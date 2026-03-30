import json
import logging
from django.db import transaction
from django.core.cache import cache
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth import login, logout
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.decorators import login_required
from .models import Produto, Pedido, ItemPedido, Favorito
from .services import processar_pagamento_simulado, enviar_email_confirmacao, notificar_whatsapp
from django.views.decorators.csrf import csrf_exempt

from .forms import CadastroForm

logger = logging.getLogger(__name__)

def home(request):
    produtos = Produto.objects.all()
    
    termo_buscado = request.GET.get('q')

    if termo_buscado:
        produtos = produtos.filter(title__icontains=termo_buscado)

    meu_dicionario_python = {
        'lista_produtos': produtos,
        'termo_buscado': termo_buscado 
    }

    return render(request, 'home.html', context=meu_dicionario_python)

@login_required(login_url='/login/')
def minha_conta(request):
    return render(request, 'minha_conta.html')

def cadastro_view(request):
    if request.method == 'POST':
        form = CadastroForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user, backend='core.backends.EmailOrUsernameBackend') 
            return redirect('home')
    else:
        form = CadastroForm()
    
    return render(request, 'cadastro.html', {'form': form})

def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('minha_conta') 
    else:
        form = AuthenticationForm()
        form.fields['username'].label = "Usuário ou E-mail"
        
    return render(request, 'login.html', {'form': form})

def logout_view(request):
    logout(request)
    return redirect('home')

def criar_pedido(request):
    if not request.user.is_authenticated:
        logger.warning(f"Tentativa de compra bloqueada (Sem Login). IP: {request.META.get('REMOTE_ADDR')}")
        return JsonResponse({"error": {"code": "UNAUTHORIZED", "message": "Você precisa fazer login para comprar. 🔒"}}, status=401)

    if request.method == "POST":
        try:
            data = json.loads(request.body)
            itens = data.get('itens', [])
            
            if not itens:
                return JsonResponse({"error": {"code": "EMPTY_CART", "message": "O carrinho está vazio."}}, status=400)

            with transaction.atomic():
                pedido = Pedido.objects.create(
                    usuario=request.user, 
                    numero_pedido=data['numero'],
                    total=0, 
                    desconto_aplicado=data.get('desconto', 0.0),
                    valor_frete=data.get('frete', 0.0) 
                )
                
                total_real_calculado = 0
                
                for item in itens:
                    if int(item['quantidade']) <= 0:
                        raise ValueError("INVALID_QUANTITY")
                        
                    produto_obj = Produto.objects.select_for_update().get(id=item['id'])
                    preco_real_banco = float(produto_obj.price) 
                    total_real_calculado += (preco_real_banco * int(item['quantidade']))
                    
                    ItemPedido.objects.create(
                        pedido=pedido,
                        produto=produto_obj,
                        quantidade=item['quantidade'],
                        preco_unitario=preco_real_banco
                    )
                
                desconto = float(data.get('desconto', 0.0))
                frete = float(data.get('frete', 0.0))
                
                if desconto > total_real_calculado:
                    raise ValueError("INVALID_DISCOUNT")
                if frete < 0:
                    raise ValueError("INVALID_FREIGHT")
                    
                pedido.total = total_real_calculado - desconto + frete
                pedido.status = 'pendente' 
                pedido.save() 

            cache.delete(f"pedidos_v1_{request.user.id}")
            logger.info(f"SUCESSO: Pedido {pedido.numero_pedido} CRIADO (Aguardando Pagamento).")
            
            return JsonResponse({"status": "sucesso", "pedido_id": pedido.id, "numero_pedido": pedido.numero_pedido})
            
        except Produto.DoesNotExist:
            return JsonResponse({"error": {"code": "PRODUCT_NOT_FOUND", "message": "Um dos produtos não existe."}}, status=404)
        except ValueError as ve:
            return JsonResponse({"error": {"code": str(ve), "message": "Dados do pedido inválidos."}}, status=400)
        except Exception as e:
            logger.error(f"ERRO FATAL no Checkout: {str(e)}", exc_info=True)
            return JsonResponse({"error": {"code": "SERVER_ERROR", "message": "Ocorreu um erro interno."}}, status=500)
            
    return JsonResponse({"error": {"code": "METHOD_NOT_ALLOWED", "message": "Use o método POST"}}, status=405)

@login_required
def api_listar_pedidos(request):
    cache_key = f"pedidos_v1_{request.user.id}"
    pedidos_data = cache.get(cache_key)
    
    if not pedidos_data:
        pedidos = Pedido.objects.filter(usuario=request.user).prefetch_related('itens__produto').order_by('-data_compra')[:10]
        pedidos_data = []
        for p in pedidos:
            itens = p.itens.all()
            itens_data = [{"titulo": i.produto.title if i.produto else "Produto Indisponível", "quantidade": i.quantidade, "preco": float(i.preco_unitario)} for i in itens]
                
            pedidos_data.append({
                "id": p.numero_pedido, 
                "data": p.data_compra.strftime("%d/%m/%Y - %H:%M"),
                "total": float(p.total),
                "descontoAplicado": float(p.desconto_aplicado),
                "frete": float(p.valor_frete), 
                "status": p.get_status_display(),
                "itens": itens_data
            })
            
        cache.set(cache_key, pedidos_data, 60)
        
    return JsonResponse({"pedidos": pedidos_data})

@login_required
def api_listar_favoritos(request):
    favoritos = Favorito.objects.filter(usuario=request.user)
    
    favs_data = []
    for f in favoritos:
        favs_data.append({
            "id": f.produto.id,
            "titulo": f.produto.title,
            "preco": float(f.produto.price), 
            "imagem": f.produto.imagem.url if f.produto.imagem else "" 
        })
        
    return JsonResponse({"favoritos": favs_data})

@login_required
def api_toggle_favorito(request):
    if request.method == "POST":
        data = json.loads(request.body)
        produto_id = data.get('id')
        
        try:
            produto = Produto.objects.get(id=produto_id)
            
            fav, created = Favorito.objects.get_or_create(usuario=request.user, produto=produto)
            
            if not created:
                fav.delete()
                return JsonResponse({"status": "removido"})
                
            return JsonResponse({"status": "adicionado"})
            
        except Produto.DoesNotExist:
            return JsonResponse({"error": {"code": "PRODUCT_NOT_FOUND", "message": "Produto não encontrado"}}, status=404)
            
    return JsonResponse({"error": {"code": "METHOD_NOT_ALLOWED", "message": "Use o método POST"}}, status=405)


@csrf_exempt
def webhook_pagamento_simulado(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            pedido_id = data.get('pedido_id')
            
            pedido = Pedido.objects.get(id=pedido_id)

            if pedido.status == 'pago':
                return JsonResponse({"status": "aviso", "mensagem": "Pagamento já processado anteriormente."})
            
            pedido.status = 'pago'
            pedido.save()
            
            processar_pagamento_simulado(pedido, "PIX")
            if pedido.usuario.email:
                enviar_email_confirmacao(pedido)
            notificar_whatsapp(pedido)
            
            cache.delete(f"pedidos_v1_{pedido.usuario.id}")
            
            return JsonResponse({"status": "sucesso", "mensagem": "Pagamento confirmado via Webhook!"})
            
        except Pedido.DoesNotExist:
            return JsonResponse({"error": "Pedido não encontrado"}, status=404)
            
    return JsonResponse({"error": "Método não permitido"}, status=405)
