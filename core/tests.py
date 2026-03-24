from django.test import TestCase, Client
from django.contrib.auth.models import User
from .models import Produto
import json

class APIPedidoTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', password='testpassword123')
        self.produto = Produto.objects.create(title='Whisky Teste', price=150.00)
        self.url = '/api/v1/criar-pedido/'

    def test_bloquear_pedido_sem_login(self):
        """ 🔥 Garante que usuários anônimos tomam erro 401 """
        payload = {"numero": "PED-TESTE", "total": 150.0, "itens": []}
        response = self.client.post(self.url, data=json.dumps(payload), content_type='application/json')
        
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()['error']['code'], "UNAUTHORIZED")

    def test_impedir_carrinho_vazio(self):
        """ 🔥 Garante que a API não aceita compras vazias """
        self.client.login(username='testuser', password='testpassword123')
        
        payload = {"numero": "PED-TESTE2", "total": 0.0, "itens": []}
        response = self.client.post(self.url, data=json.dumps(payload), content_type='application/json')
        
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error']['code'], "EMPTY_CART")

    def test_criar_pedido_com_sucesso(self):
        """ 🔥 O "Caminho Feliz": Garante que um pedido válido é salvo corretamente """
        self.client.login(username='testuser', password='testpassword123')
        
        payload = {
            "numero": "PED-TESTE3", 
            "total": 150.0, 
            "desconto": 0.0,
            "itens": [{"id": self.produto.id, "quantidade": 1, "preco": 150.0}]
        }
        
        response = self.client.post(self.url, data=json.dumps(payload), content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], "sucesso")
