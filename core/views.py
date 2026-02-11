from django.shortcuts import render
from .models import Produto

# Create your views here.
def home(request):
    produtos = Produto.objects.all()

    meu_dicionario_python = {
        'lista_produtos': produtos
    }

    return render(request, 'home.html', context=meu_dicionario_python)
