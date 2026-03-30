from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from .models import Perfil

class CadastroForm(UserCreationForm):
    email = forms.EmailField(required=True, help_text="Você poderá usar este e-mail para fazer login.")
    cpf = forms.CharField(max_length=14, label="CPF")
    cep = forms.CharField(max_length=9, label="CEP")
    endereco = forms.CharField(max_length=255, label="Endereço Completo")
    numero = forms.CharField(max_length=10, label="Número")
    complemento = forms.CharField(max_length=100, required=False, label="Complemento (Opcional)")

    class Meta(UserCreationForm.Meta):
        model = User
        fields = UserCreationForm.Meta.fields + ('email',)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        self.fields['username'].label = "Username"
        self.fields['email'].label = "Email"
        
        self.fields['username'].help_text = "Obrigatório. Letras, números e os símbolos @/./+/-/_ apenas."

    def clean_username(self):
        username = self.cleaned_data.get('username')
        if len(username) > 30:
            raise forms.ValidationError("O nome de usuário deve ter no máximo 30 caracteres.")
        return username

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data['email']
        
        if commit:
            user.save()
            
            Perfil.objects.create(
                user=user,
                cpf=self.cleaned_data['cpf'],
                cep=self.cleaned_data['cep'],
                endereco=self.cleaned_data['endereco'],
                numero=self.cleaned_data['numero'],
                complemento=self.cleaned_data['complemento']
            )
        return user