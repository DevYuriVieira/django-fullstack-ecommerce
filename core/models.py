from django.db import models

# Create your models here.
class Produto(models.Model):
    title = models.CharField()
    price = models.DecimalField(max_digits=5, decimal_places=2)
    url_img = models.URLField(null=True)
    imagem = models.ImageField(upload_to='produtos/', null=True)

    def __str__(self):
        return f"{self.title}"
