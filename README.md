# Social-Network-App

## :star2: About the Project

A social network app similar to twitter or facebook

## :dart: Features

- JWT-based authentication (login, signup, logout)
- Create, like, and comment on posts
- Real-time private messaging
- Friend request system (send, accept, reject)
- Profile editing with avatar upload
- Human-readable timestamps

## :space_invader: Tech Stack

<details>
  <summary>Client</summary>
  <ul>
    <li><a href="https://vuejs.org/">Vue.js 3</a></li>
    <li><a href="https://tailwindcss.com/">TailwindCSS</a></li>
    <li><a href="https://pinia.vuejs.org/">Pinia</a></li>
    <li><a href="https://axios-http.com/">Axios</a></li>
  </ul>
</details>

<details>
  <summary>Server</summary>
  <ul>
    <li><a href="https://www.djangoproject.com/">Django</a></li>
    <li><a href="https://www.django-rest-framework.org/">Django REST Framework</a></li>
    <li><a href="https://channels.readthedocs.io/">Django Channels</a></li>
    <li><a href="https://jwt.io/">JWT Authentication</a></li>
  </ul>
</details>


## :camera: Screenshots

<div align="center"> 
  <img src="https://placehold.co/600x400?text=Feed+View" alt="Feed Screenshot" />
  <img src="https://placehold.co/600x400?text=Chat+View" alt="Chat Screenshot" />
  <img src="https://placehold.co/600x400?text=Profile+View" alt="Profile Screenshot" />
</div>

## :toolbox: Getting Started

### :bangbang: Prerequisites

- Python 3.11+
- Node.js and npm


### :running: Run Locally

Clone the project

```bash
git clone https://github.com/gael-gautho/social-network-app.git
```

Go to the project directory

```bash
  cd social-network-app 
```

Install backend dependencies

```bash
cd django_backend
pip install -r requirements.txt
```

Apply migrations and create your database

```bash
python manage.py migrate
```

Start the server

```bash
python manage.py runserver
```

Install frontend dependencies

```bash
cd ../vue_frontend
npm install
```

Start the server

```bash
npm run dev
```



