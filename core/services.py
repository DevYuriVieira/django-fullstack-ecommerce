import logging
from django.core.mail import send_mail

logger = logging.getLogger(__name__)

def processar_pagamento_simulado(pedido, metodo="PIX"):
    """
    Simula a aprovação de um pagamento.
    Em um sistema real, aqui chamaríamos a API da Stripe ou Mercado Pago.
    """
    logger.info(f"💰 Processando pagamento via {metodo} para o pedido {pedido.numero_pedido}...")
    
    pedido.status = "pago"
    pedido.save()
    
    logger.info(f"✅ Pagamento aprovado! Status do pedido atualizado.")
    return True

def enviar_email_confirmacao(pedido):
    """
    Envia o e-mail usando o backend configurado no settings.py.
    """
    assunto = f"Casa da Birita - Pedido {pedido.numero_pedido} Confirmado! 🍻"
    mensagem = f"""
    Olá {pedido.usuario.username},
    
    Seu pedido {pedido.numero_pedido} foi recebido e o pagamento foi aprovado!
    
    Valor Total: R$ {pedido.total}
    
    Obrigado por comprar com a gente!
    """
    
    try:
        send_mail(
            assunto,
            mensagem,
            "vendas@casadabirita.com.br",
            [pedido.usuario.email],
            fail_silently=False,
        )
        logger.info(f"📧 E-mail de confirmação enviado para {pedido.usuario.email}")
    except Exception as e:
        logger.error(f"❌ Erro ao enviar e-mail: {str(e)}")

def notificar_whatsapp(pedido):
    """
    Simula o disparo de uma mensagem no WhatsApp.
    """
    telefone_cliente = "+5522999999999" 
    logger.info(f"📱 [WhatsApp API Simulado] Mensagem enviada para {telefone_cliente}: 'Seu pedido {pedido.numero_pedido} está sendo separado!'")