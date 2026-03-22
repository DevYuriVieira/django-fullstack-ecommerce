from django.contrib import admin
from .models import Produto, Pedido, ItemPedido, Favorito

# Register your models here.
admin.site.register(Produto)
admin.site.register(Pedido)
admin.site.register(ItemPedido)
admin.site.register(Favorito)
