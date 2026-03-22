from django.shortcuts import render, redirect
from django.contrib.auth import login, logout
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.decorators import login_required 
from .models import Produto

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
