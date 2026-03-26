# 🛒 Production-Ready Fullstack E-commerce (Django + Vanilla JS)

<div align="center">

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square\&logo=python\&logoColor=white)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-5.x-092E20?style=flat-square\&logo=django\&logoColor=white)](https://www.djangoproject.com/)
[![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=flat-square\&logo=sqlite\&logoColor=white)](https://www.sqlite.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=flat-square\&logo=javascript\&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-Semantic-E34F26?style=flat-square\&logo=html5\&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-Modern-1572B6?style=flat-square\&logo=css3\&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

• [Overview](#-overview) • [Features](#-features) • [Architecture](#-architecture) • [Getting Started](#-getting-started)

</div>

---

## 🇺🇸 English Version

# 🎯 Overview

This project is a full-stack e-commerce platform built with Django and Vanilla JavaScript, designed to simulate real-world production architecture.

It goes beyond a simple CRUD system by implementing asynchronous workflows, service decoupling, and a modular frontend structure.

The goal is to demonstrate **real engineering thinking**, focusing on scalability, security, and maintainability.

---

# 🚀 Engineering Impact

* Implemented asynchronous payment flow using webhook simulation  
* Designed idempotent logic to prevent duplicate transaction processing  
* Eliminated frontend framework overhead with native browser APIs  
* Structured backend using service layer and atomic transactions  
* Built a scalable API-first architecture  

---

# 📊 Performance Highlights

- ⚡ Optimized database queries using `prefetch_related` (avoiding N+1 problem)  
- 🚀 Reduced unnecessary API calls with debounce strategy in search  
- 📦 Zero frontend framework overhead (Vanilla JS only)  
- 🎯 Efficient DOM updates using template-based rendering  
- 🔄 Centralized state management to prevent redundant re-renders  
- 🧠 Asynchronous flow reduces blocking operations during checkout  
- 🔒 Secure request handling with CSRF protection  

---

# ✨ Features

* **Authentication System:** Login, logout, and protected routes  
* **Shopping Cart:** Sidebar cart with dynamic updates  
* **Coupon Engine:** Business rule validation (e.g. discount thresholds)  
* **Wishlist System:** Persistent favorites per user  
* **Order History:** Relational data modeling with user linkage  
* **REST API:** Versioned endpoints with JSON responses  

---

# 📡 API Example

```http
POST /api/v1/orders/ HTTP/1.1
Content-Type: application/json
Authorization: Bearer <token>

{
  "items": [
    { "product_id": 1, "quantity": 2 }
  ],
  "coupon": "BIRITA10"
}
```

### Response

```json
{
  "status": "pending",
  "order_id": 123
}
```

---

# ⚡ Asynchronous Payment Flow (Highlight)

* Orders created with **pending status**  
* Payment simulated via webhook endpoint  
* Status transition: `pending → paid`  
* Post-processing triggered only after confirmation  
* Idempotent Webhook: prevents duplicate processing of the same payment event  

---

# 🧠 Engineering Strategy

### Backend

* Django as API (without DRF)  
* Service Layer pattern for business logic  
* Atomic transactions for data consistency  
* Query optimization to avoid N+1 problems  

### Frontend

* Vanilla JavaScript with modular architecture  
* Custom state management system  
* Template-based Componentization using native `<template>` elements  
* Clean separation between logic and UI  

---

# 🧩 Architecture Highlights

- Separation between domain logic and service layer  
- API-first design with versioned endpoints  
- Modular frontend with isolated concerns per feature  

---

# 🧠 Design Decisions

- Chose Vanilla JS to minimize bundle size and maximize performance  
- Opted out of Django REST Framework to maintain full control over HTTP layer and request lifecycle  
- Implemented Service Layer to decouple business logic from views  
- Used template-based rendering to avoid unsafe innerHTML usage  

# 🔐 Security

- CSRF protection enabled for all sensitive requests  
- Authentication required for protected endpoints  
- Backend validation for all business rules  
- Safe DOM manipulation using textContent to prevent XSS  

---

# 🏗 Architecture

## Folder Structure

```text
fullstack-ecommerce-django
├── Casa_da_Birita/
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py / asgi.py
├── core/
│   ├── migrations/
│   ├── static/
│   │   ├── css/
│   │   ├── images/
│   │   └── js/
│   │       ├── api.js
│   │       ├── cart.js
│   │       ├── checkout.js
│   │       ├── coupon.js
│   │       ├── favorites.js
│   │       ├── main.js
│   │       ├── painel.js
│   │       └── store.js
│   ├── templates/
│   │   ├── base.html
│   │   ├── cadastro.html
│   │   ├── checkout_templates.html
│   │   ├── home.html
│   │   ├── login.html
│   │   └── minha_conta.html
│   ├── admin.py
│   ├── models.py
│   ├── services.py
│   ├── urls.py
│   └── views.py
├── venv/
├── .gitignore
├── db.sqlite3
├── manage.py
└── requirements.txt
```

---

# ⚙️ Technology Stack

| Layer    | Technology | Purpose              |
|----------|-----------|----------------------|
| Backend  | Django    | API & Business Logic |
| Language | Python    | Core Development     |
| Database | SQLite    | Data Persistence     |
| Frontend | HTML + CSS| Structure & Styling  |
| JS Layer | Vanilla JS| UI Logic             |

---

# 🚀 Getting Started

```bash
git clone https://github.com/your-username/fullstack-ecommerce-django.git
cd fullstack-ecommerce-django

python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

---

# 🚀 Future Improvements

- Integrate real payment gateway (Stripe / Mercado Pago) for production readiness  
- Introduce caching layer with Redis to improve performance  
- Implement background jobs using Celery for async processing  
- Migrate to PostgreSQL for better scalability and reliability  

---

# 🧠 What This Project Demonstrates

* Full-stack engineering skills  
* Real-world e-commerce flow design  
* API architecture and separation of concerns  
* Asynchronous systems (webhooks)  
* Clean frontend architecture without frameworks  

---

# 🎯 Key Takeaway

This project demonstrates the ability to design and implement a production-oriented full-stack system, combining backend robustness with a lightweight and scalable frontend architecture.

---

# 👨‍💻 Author

Yuri Vieira Teixeira

---

# 📄 License

MIT License

---

## 🇧🇷 Versão em Português

# 🎯 Visão Geral

Este projeto é uma plataforma de e-commerce full-stack construída com Django e JavaScript puro, projetada para simular uma arquitetura real de produção.

Ele vai além de um CRUD simples ao implementar fluxos assíncronos, desacoplamento de serviços e uma estrutura de frontend modular.

O objetivo é demonstrar **pensamento de engenharia**, com foco em escalabilidade, segurança e manutenibilidade.

---

# 🚀 Impacto de Engenharia

* Implementação de fluxo de pagamento assíncrono via webhook  
* Lógica idempotente para evitar processamento duplicado de transações  
* Eliminação de dependência de frameworks frontend pesados  
* Estruturação do backend com Service Layer e transações atômicas  
* Arquitetura baseada em API versionada  

---

# 📊 Destaques de Performance

- ⚡ Otimização de queries com `prefetch_related` (evitando problema de N+1)  
- 🚀 Redução de chamadas desnecessárias com estratégia de debounce  
- 📦 Zero overhead de framework no frontend (Vanilla JS)  
- 🎯 Atualizações eficientes do DOM com renderização baseada em templates  
- 🔄 Gerenciamento de estado centralizado evitando re-renderizações desnecessárias  
- 🧠 Fluxo assíncrono reduz operações bloqueantes no checkout  
- 🔒 Proteção de requisições com CSRF  

---

# ✨ Funcionalidades

* Sistema de autenticação (login, logout e rotas protegidas)  
* Carrinho de compras dinâmico  
* Sistema de cupons com validação de regras de negócio  
* Lista de favoritos persistente por usuário  
* Histórico de pedidos com modelagem relacional  
* API REST com endpoints versionados  

---

# ⚡ Fluxo de Pagamento Assíncrono (Destaque)

* Pedidos criados com status **pending**  
* Pagamento simulado via endpoint de webhook  
* Transição de status: `pending → paid`  
* Pós-processamento executado somente após confirmação  
* Webhook idempotente para evitar duplicidade de processamento  

---

# 🧠 Estratégia de Engenharia

### Backend

* Django utilizado como API (sem uso de DRF)  
* Padrão Service Layer para isolamento da lógica de negócio  
* Uso de transações atômicas para consistência de dados  
* Otimização de queries para evitar problemas de performance  

### Frontend

* JavaScript puro com arquitetura modular  
* Sistema de gerenciamento de estado customizado  
* Componentização com `<template>` nativo do HTML5  
* Separação clara entre lógica e interface  

---

# 🧩 Destaques de Arquitetura

- Separação entre lógica de domínio e camada de serviços  
- Design API-first com endpoints versionados  
- Frontend modular com responsabilidades isoladas por feature  

---

# 🧠 Decisões de Design

- Uso de JavaScript puro para reduzir bundle e maximizar performance  
- Não utilização do Django REST Framework para manter controle total sobre a camada HTTP  
- Implementação de Service Layer para desacoplar lógica de negócio das views  
- Uso de renderização baseada em templates para evitar uso inseguro de `innerHTML`  

---

# 🔐 Segurança

- Proteção CSRF em todas as requisições sensíveis  
- Autenticação obrigatória em endpoints protegidos  
- Validação de regras de negócio no backend  
- Manipulação segura do DOM com `textContent` para prevenir XSS  

---

# 🚀 Melhorias Futuras

- Integração com gateway de pagamento real (Stripe / Mercado Pago)  
- Implementação de cache com Redis para ganho de performance  
- Processamento assíncrono com Celery (background jobs)  
- Migração para PostgreSQL visando maior escalabilidade  

---

# 🧠 O Que Este Projeto Demonstra

* Habilidades completas de desenvolvimento full-stack  
* Modelagem de fluxo real de e-commerce  
* Arquitetura baseada em API e separação de responsabilidades  
* Implementação de sistemas assíncronos (webhooks)  
* Arquitetura frontend limpa sem uso de frameworks  

---

# 🎯 Conclusão

Este projeto demonstra a capacidade de projetar e implementar um sistema full-stack orientado à produção, combinando robustez no backend com uma arquitetura frontend leve e escalável.

---

# 📄 Licença

MIT License
