# ShopNext — Ecommerce Frontend

Frontend de una tienda ecommerce desarrollado con **Next.js 16**, **React**, **TypeScript**, **Tailwind CSS** y **Stripe**, integrado con una API REST desarrollada previamente con **Laravel 12**.

El proyecto permite consultar productos, registrarse, iniciar sesión, administrar un carrito persistente, crear órdenes y realizar pagos mediante Stripe.

---

## 🚀 Tecnologías

* **Next.js 16.3.8**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **Lucide React**
* **Stripe.js**
* **Stripe React**
* **Laravel 12 API**
* **Laravel Sanctum**
* **Stripe Payment Intents**
* **LocalStorage**
* **Next.js Server Actions**
* **Next.js Proxy**
* **Next.js Server Components**

---

## 📋 Requisitos

Antes de ejecutar el proyecto necesitas tener instalado:

* Node.js 20+
* npm
* La API Laravel funcionando
* Una cuenta de Stripe para obtener las claves de prueba

---

## 📦 Instalación

Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
```

Entrar al proyecto:

```bash
cd ecommerce-frontend-FSJ35
```

Instalar dependencias:

```bash
npm install
```

Crear el archivo de variables de entorno:

```bash
.env.local
```

Agregar las variables necesarias:

```env
BASE_URL=http://127.0.0.1:8000

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_TU_CLAVE
```

> `BASE_URL` debe apuntar a la URL donde está ejecutándose la API Laravel.

---

## 🔐 Variables de entorno

El proyecto utiliza las siguientes variables:

| Variable                             | Descripción                |
| ------------------------------------ | -------------------------- |
| `BASE_URL`                           | URL base de la API Laravel |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Clave pública de Stripe    |

Nunca se debe subir `.env.local` al repositorio.

El proyecto incluye un archivo `.env.example` como referencia:

```env
BASE_URL=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

---

## ▶️ Ejecutar en desarrollo

Iniciar el servidor:

```bash
npm run dev
```

La aplicación estará disponible en:

```text
http://localhost:3000
```

---

## 🏗️ Ejecutar en producción

Generar el build:

```bash
npm run build
```

Iniciar la aplicación:

```bash
npm run start
```

El proyecto fue validado correctamente mediante el build de producción de Next.js.

---

## 🧱 Arquitectura

La aplicación utiliza **Next.js App Router**.

```text
ecommerce-frontend-FSJ35/
│
├── app/
│   ├── page.tsx
│   ├── products/
│   │   └── [id]/
│   ├── login/
│   ├── register/
│   ├── cart/
│   ├── checkout/
│   ├── orders/
│   │   └── [id]/
│   └── payment/
│       └── success/
│
├── actions/
│   ├── auth.ts
│   ├── orders.ts
│   └── payments.ts
│
├── components/
│   ├── auth/
│   ├── cart/
│   ├── checkout/
│   ├── layout/
│   └── products/
│
├── context/
│   └── CartContext.tsx
│
├── lib/
│   ├── api.ts
│   ├── auth.ts
│   └── types.ts
│
├── proxy.ts
├── next.config.ts
└── .env.example
```

---

# 🔌 Integración con la API Laravel

El frontend consume la API REST desarrollada en Laravel.

### Productos

```http
GET /api/products
```

Obtiene el catálogo de productos activos.

```http
GET /api/products/{id}
```

Obtiene el detalle de un producto.

### Autenticación

```http
POST /api/register
```

Registra un nuevo usuario.

```http
POST /api/login
```

Autentica al usuario.

```http
POST /api/logout
```

Cierra la sesión del usuario autenticado.

### Órdenes

```http
POST /api/orders
```

Crea una nueva orden.

```http
GET /api/orders
```

Obtiene las órdenes del usuario autenticado.

```http
GET /api/orders/{id}
```

Obtiene el detalle de una orden.

### Pagos

```http
POST /api/orders/{id}/payment
```

Crea un PaymentIntent de Stripe para una orden pendiente.

---

# 🔑 Autenticación

La autenticación utiliza **Laravel Sanctum**.

Después de iniciar sesión, Laravel devuelve un token.

El frontend almacena dicho token en una cookie:

```text
auth_token
```

La cookie está configurada como:

```text
httpOnly: true
secure: true en producción
sameSite: lax
path: /
```

El token no se almacena en:

* LocalStorage
* SessionStorage
* variables accesibles desde JavaScript del navegador

Las llamadas autenticadas hacia Laravel utilizan:

```http
Authorization: Bearer {token}
```

---

# 🛡️ Protección de rutas

Las rutas que requieren autenticación están protegidas mediante `proxy.ts`.

Actualmente se protegen:

```text
/orders
/orders/*
/checkout
/checkout/*
```

Si un usuario no autenticado intenta acceder a una de estas rutas, es enviado a:

```text
/login?redirect=/ruta-original
```

Después de iniciar sesión, el usuario vuelve a la ruta que intentaba visitar.

---

# 🛒 Carrito

El carrito se implementa mediante React Context:

```text
context/CartContext.tsx
```

Características:

* Agregar productos
* Eliminar productos
* Incrementar cantidad
* Reducir cantidad
* Validación contra stock disponible
* Cálculo automático del total
* Persistencia mediante `localStorage`

La información almacenada localmente corresponde únicamente al carrito.

El token de autenticación nunca se almacena en `localStorage`.

---

# 📦 Creación de órdenes

Desde el carrito se envían únicamente los datos necesarios:

```json
{
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    }
  ]
}
```

La orden es creada por la API Laravel.

El backend se encarga de:

* Validar productos
* Validar stock
* Crear la orden
* Crear los detalles
* Calcular el total
* Descontar inventario

El frontend no confía en el precio almacenado en el carrito para crear la orden.

---

# 💳 Pagos con Stripe

El flujo de pago utiliza **Stripe Payment Intents** y **Stripe Elements**.

Flujo:

```text
Carrito
   │
   ▼
Crear orden
   │
   ▼
Checkout
   │
   ▼
Laravel crea PaymentIntent
   │
   ▼
Stripe devuelve client_secret
   │
   ▼
Stripe Payment Element
   │
   ▼
Confirmación del pago
   │
   ▼
Stripe Webhook
   │
   ▼
Laravel actualiza la orden
   │
   ▼
Orden pagada
```

El frontend no ejecuta directamente el webhook.

El webhook es llamado por Stripe:

```http
POST /api/stripe/webhook
```

Esto permite que el estado final de la orden sea determinado por el backend después de recibir la confirmación de Stripe.

---

# 🧪 Prueba de pagos

Para realizar pruebas en modo test se puede utilizar una tarjeta de prueba de Stripe:

```text
Número: 4242 4242 4242 4242
Fecha: cualquier fecha futura
CVC: cualquier valor
ZIP: cualquier valor
```

> Las tarjetas de prueba de Stripe deben utilizarse únicamente en el entorno de pruebas.

---

# 📄 Server Components

Las operaciones de lectura se realizan preferentemente mediante **Server Components**.

Por ejemplo:

```text
app/page.tsx
app/products/[id]/page.tsx
app/orders/page.tsx
app/orders/[id]/page.tsx
app/checkout/page.tsx
```

Esto permite realizar las consultas a la API desde el servidor y reducir JavaScript innecesario en el navegador.

Los Client Components se utilizan cuando se necesita interactividad, por ejemplo:

* Carrito
* Formularios
* Stripe Elements
* Botones interactivos

---

# ⚡ Server Actions

Las mutaciones principales utilizan Server Actions:

```text
actions/auth.ts
actions/orders.ts
actions/payments.ts
```

Se utilizan para:

* Login
* Registro
* Logout
* Creación de órdenes
* Creación del PaymentIntent

Después de algunas mutaciones se utiliza:

```ts
revalidatePath()
```

para mantener actualizados los datos de las páginas correspondientes.

---

# ⏳ Estados de carga

Se implementaron archivos `loading.tsx` en las principales rutas:

```text
app/loading.tsx
app/cart/loading.tsx
app/checkout/loading.tsx
app/orders/loading.tsx
app/orders/[id]/loading.tsx
app/payment/success/loading.tsx
```

Esto proporciona feedback visual mientras Next.js obtiene los datos.

---

# ❌ Manejo de errores

Se implementaron Error Boundaries mediante `error.tsx`.

Entre las rutas que cuentan con manejo de errores están:

```text
app/error.tsx
app/cart/error.tsx
app/checkout/error.tsx
app/orders/error.tsx
app/orders/[id]/error.tsx
app/payment/success/error.tsx
```

Los errores incluyen una opción para volver a intentar la operación mediante:

```ts
reset()
```

---

# ⏱️ Suspense

El catálogo utiliza `Suspense` para mostrar un estado de carga mientras se obtienen los productos.

Esto permite separar la carga de la interfaz principal de la carga de la información dinámica.

---

# 🛣️ Rutas de la aplicación

| Ruta               | Descripción           | Protección             |
| ------------------ | --------------------- | ---------------------- |
| `/`                | Catálogo              | Pública                |
| `/products/[id]`   | Detalle de producto   | Pública                |
| `/login`           | Inicio de sesión      | Pública                |
| `/register`        | Registro              | Pública                |
| `/cart`            | Carrito               | Pública                |
| `/checkout`        | Checkout y pago       | 🔒 Autenticada         |
| `/orders`          | Historial de compras  | 🔒 Autenticada         |
| `/orders/[id]`     | Detalle de compra     | 🔒 Autenticada         |
| `/payment/success` | Confirmación del pago | 🔒 Asociada al usuario |

---

# 📈 Rendimiento

El proyecto fue probado utilizando **Lighthouse** sobre la versión de producción.

Resultado obtenido:

```text
Performance: 94
```

El objetivo establecido para el proyecto era:

```text
Performance ≥ 90
```

Por lo tanto, el proyecto cumple con el objetivo de rendimiento establecido.

---

# 🧪 Validación del build

El proyecto fue compilado correctamente mediante:

```bash
npm run build
```

Resultado:

```text
✓ Compiled successfully
✓ Finished TypeScript
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

No se detectaron errores de TypeScript durante el build de producción.

---

# 🔒 Consideraciones de seguridad

* El token de autenticación se almacena en una cookie `httpOnly`.
* El token no se almacena en LocalStorage.
* Las rutas privadas están protegidas.
* Las peticiones autenticadas utilizan Bearer Token.
* El frontend no procesa ni almacena datos sensibles de tarjetas.
* Stripe Elements maneja los datos de pago.
* El webhook de Stripe es procesado por el backend Laravel.
* Las URLs de redirección después del login son validadas para evitar redirecciones externas.

---

# 📁 Variables de entorno

Crear:

```text
.env.local
```

con:

```env
BASE_URL=http://127.0.0.1:8000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_TU_CLAVE
```

Para compartir la estructura de configuración se utiliza:

```text
.env.example
```

No incluir credenciales reales en el repositorio.

---

# 👨‍💻 Desarrollo

Ejecutar:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Producción:

```bash
npm run start
```

---

# 📝 Flujo completo de compra

El flujo principal de la aplicación es:

```text
1. Usuario entra al catálogo
        ↓
2. Selecciona un producto
        ↓
3. Agrega el producto al carrito
        ↓
4. Revisa el carrito
        ↓
5. Inicia sesión o se registra
        ↓
6. Se crea la orden
        ↓
7. Se muestra el checkout
        ↓
8. Se prepara el PaymentIntent
        ↓
9. Usuario introduce sus datos en Stripe
        ↓
10. Stripe procesa el pago
        ↓
11. Stripe envía el webhook a Laravel
        ↓
12. Laravel actualiza la orden
        ↓
13. Usuario visualiza la confirmación
        ↓
14. Usuario puede consultar su historial
```

---

# 📚 Proyecto académico

Este proyecto forma parte de un ejercicio de desarrollo **Full Stack Junior**, cuyo objetivo es construir un frontend ecommerce moderno integrado con una API REST existente.

El proyecto aplica conceptos de:

* React
* Next.js
* TypeScript
* Server Components
* Server Actions
* REST APIs
* Autenticación
* Persistencia de estado
* Stripe
* Manejo de errores
* Optimización web
* Arquitectura modular
