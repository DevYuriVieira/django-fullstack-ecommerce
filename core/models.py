from django.db import models
from django.contrib.auth.models import User

class Produto(models.Model):
    title = models.CharField()
    price = models.DecimalField(max_digits=5, decimal_places=2)
    url_img = models.URLField(null=True)
    imagem = models.ImageField(upload_to='produtos/', null=True)

    def __str__(self):
        return f"{self.title}"
    
class Pedido(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    numero_pedido = models.CharField(max_length=20, unique=True)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    desconto_aplicado = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    data_compra = models.DateTimeField(auto_now_add=True) 
    valor_frete = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    status = models.CharField(
        max_length=20,
        choices=[
            ("pendente", "Pendente ⏳"),
            ("pago", "Pago 💰"),
            ("enviado", "Enviado 🚚"),
            ("entregue", "Entregue ✅"),
        ],
        default="pendente"
    )

    def __str__(self):
        return f"{self.numero_pedido} - {self.status} - {self.usuario.username if self.usuario else 'Visitante'}"

class ItemPedido(models.Model):
    pedido = models.ForeignKey(Pedido, related_name='itens', on_delete=models.CASCADE)
    produto = models.ForeignKey('Produto', on_delete=models.SET_NULL, null=True)
    quantidade = models.IntegerField(default=1)
    preco_unitario = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantidade}x {self.produto.title if self.produto else 'Produto Excluído'}"

class Favorito(models.Model):
    usuario = models.ForeignKey(User, related_name='favoritos', on_delete=models.CASCADE)
    produto = models.ForeignKey('Produto', on_delete=models.CASCADE)
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('usuario', 'produto') 

    def __str__(self):
        return f"{self.usuario.username} ❤️ {self.produto.title}"
