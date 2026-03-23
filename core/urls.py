from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('minha-conta/', views.minha_conta, name='minha_conta'),
    
    path('login/', views.login_view, name='login'),
    path('cadastro/', views.cadastro_view, name='cadastro'),
    path('logout/', views.logout_view, name='logout'),
    path('api/criar-pedido/', views.criar_pedido, name='api_criar_pedido'),
    path('api/pedidos/', views.api_listar_pedidos, name='api_listar_pedidos'),
    path('api/favoritos/', views.api_listar_favoritos, name='api_listar_favoritos'),
    path('api/favoritos/toggle/', views.api_toggle_favorito, name='api_toggle_favorito'),
]