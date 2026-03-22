from django.shortcuts import render, redirect
from django.contrib.auth import login, logout
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.decorators import login_required 
from .models import Produto
import json
from django.http import JsonResponse
from .models import Produto, Pedido, ItemPedido

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

def criar_pedido(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            
            pedido = Pedido.objects.create(
                usuario=request.user if request.user.is_authenticated else None, 
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
