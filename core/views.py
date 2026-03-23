from django.shortcuts import render, redirect
from django.contrib.auth import login, logout
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.decorators import login_required 
from .models import Produto
import json
from django.http import JsonResponse
from .models import Produto, Pedido, ItemPedido
from django.contrib.auth.decorators import login_required
from .models import Produto, Pedido, ItemPedido, Favorito

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
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user) 
            return redirect('home')
    else:
        form = UserCreationForm()
    
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
        
    return render(request, 'login.html', {'form': form})

def logout_view(request):
    logout(request)
    return redirect('home')

# --- API ENDPOINTS ---

def criar_pedido(request):
    # 🔥 1. SEGURANÇA: Bloqueia a API para quem não tem conta/não está logado
    if not request.user.is_authenticated:
        return JsonResponse({"status": "erro", "mensagem": "Você precisa fazer login para comprar. 🔒"}, status=401)

    if request.method == "POST":
        try:
            data = json.loads(request.body)
            
            pedido = Pedido.objects.create(
                usuario=request.user, # Agora é 100% seguro salvar direto no request.user
                numero_pedido=data['numero'],
                total=data['total'],
                desconto_aplicado=data.get('desconto', 0.0)
            )
            
            for item in data['itens']:
                produto_obj = Produto.objects.get(id=item['id'])
                ItemPedido.objects.create(
                    pedido=pedido,
                    produto=produto_obj,
                    quantidade=item['quantidade'],
                    preco_unitario=item['preco']
                )
                
            return JsonResponse({"status": "sucesso", "mensagem": "Pedido salvo com sucesso!"})
            
        except Exception as e:
            return JsonResponse({"status": "erro", "mensagem": str(e)}, status=400)
            
    return JsonResponse({"status": "invalido", "mensagem": "Use o método POST"}, status=405)


@login_required
def api_listar_pedidos(request):
    pedidos = Pedido.objects.filter(usuario=request.user).prefetch_related('itens__produto').order_by('-data_compra')[:10]
    
    pedidos_data = []
    for p in pedidos:
        itens = p.itens.all()
        itens_data = []
        for i in itens:
            itens_data.append({
                "titulo": i.produto.title if i.produto else "Produto Indisponível",
                "quantidade": i.quantidade,
                "preco": float(i.preco_unitario)
            })
            
        pedidos_data.append({
            "id": p.numero_pedido, 
            "data": p.data_compra.strftime("%d/%m/%Y - %H:%M"),
            "total": float(p.total),
            "descontoAplicado": float(p.desconto_aplicado),
            "status": p.get_status_display(),
            "itens": itens_data
        })
        
    return JsonResponse({"pedidos": pedidos_data})

@login_required
def api_listar_favoritos(request):
    favoritos = Favorito.objects.filter(usuario=request.user)
    
    favs_data = []
    for f in favoritos:
        favs_data.append({
            "id": f.produto.id,
            "titulo": f.produto.title,
            "preco": float(f.produto.preco), 
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
            return JsonResponse({"status": "erro", "mensagem": "Produto não encontrado"}, status=404)
            
    return JsonResponse({"status": "erro"}, status=400)
