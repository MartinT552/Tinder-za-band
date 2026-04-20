#  TinderZaBende

> Spletna aplikacija za iskanje članov glasbenih bendov — povežite glasbenike z bendi na enostaven in intuitiven način.

TinderZaBende deluje po principu vzajemnega všečkanja (**matching**): glasbenik brska po objavah bendov, band pa brska po profilih glasbenikov. Ko oba izrazita interes drug za drugega, se ustvari **match** in oba prejmeta kontaktne podatke.

---

##  Funkcionalnosti

-  **Profil glasbenika** — registracija z instrumentom, žanrom, krajem in profilno sliko
-  **Profil benda** — ustvarjanje benda z opisom, sliko in krajem
-  **Objave** — band objavi oglas za iskanje glasbenikov
-  **Matching** — like/dislike sistem z vzajemnim preverjanjem
-  **Match obvestilo** — ob uspešnem matchu se prikažejo kontaktni podatki
-  **Avtentikacija** — JWT zaščiteni endpointi, BCrypt hashiranje gesel
-  **Nalaganje slik** — profilne slike za glasbenike in bende

---

## 🛠️ Tehnološki sklad

### Frontend
| Tehnologija | Namen |
|---|---|
| [React 18](https://react.dev) | UI knjižnica |
| [React Router DOM v6](https://reactrouter.com) | Navigacija med stranmi (SPA) |
| [Vite](https://vitejs.dev) | Razvojno okolje in gradnja |
| CSS (custom) | Oblikovanje — temna tema z glassmorphism efektom |

### Backend
| Tehnologija | Namen |
|---|---|
| [ASP.NET Core 8](https://dotnet.microsoft.com) | REST API strežnik |
| [Entity Framework Core](https://docs.microsoft.com/ef/core) | ORM za dostop do baze |
| [PostgreSQL](https://www.postgresql.org) | Relacijska podatkovna baza |
| [JWT Bearer](https://jwt.io) | Avtentikacija in avtorizacija |
| [BCrypt (PasswordHasher)](https://docs.microsoft.com/aspnet/core/security/authentication/identity) | Hashiranje gesel |
| [Swagger / OpenAPI](https://swagger.io) | Dokumentacija API-ja |

---

##  Navodila za zagon

### 1. Zagon backenda

Odpri mapo `TinderZaBendeBackend` v **Visual Studio** in pritisni gumb ▶️ **Run**.

---

### 2. Zagon frontenda

```bash
cd frontend
npm run dev
```

Frontend bo dostopen na: `http://localhost:5173`

---


##  Struktura projekta

```
Tinder-za-band/
├── frontend/                          # React aplikacija
│   └── src/
│       ├── strani/                    # Strani aplikacije
│       │   ├── Register.jsx           # Registracija glasbenika
│       │   ├── Login.jsx              # Prijava
│       │   ├── Profile.jsx            # Profil glasbenika
│       │   ├── CreateBand.jsx         # Ustvarjanje / prikaz benda
│       │   ├── Matching.jsx           # Matching sistem
│       │   └── SpremeniProfil.jsx     # Urejanje profila
│       ├── komponenti/
│       │   └── Navbar.jsx             # Navigacijska vrstica
│       └── css/
│           └── App.css                # Globalni stili
│
└── TinderZaBendeBackend/              # ASP.NET Core backend
    └── TinderZaBendeBackend/
        ├── Controllers/               # API kontrolerji
        │   ├── AuthController.cs      # Registracija, prijava, /me
        │   ├── BandController.cs      # CRUD za bende, objave
        │   ├── MatchingController.cs  # Matching logika
        │   └── KrajiController.cs     # Šifrant krajev
        ├── Models/Entities/           # EF Core modeli
        ├── DTO/                       # Data Transfer Objects
        └── Data/
            └── ApplicationDbContext.cs
```

---

## 🗄️ Podatkovna baza

Aplikacija uporablja PostgreSQL z naslednjimi glavnimi tabelami:

| Tabela | Opis |
|---|---|
| `Uporabniki` | Profili glasbenikov |
| `band` | Profili glasbenih bendov |
| `Kraji` | Šifrant krajev |
| `Objave` | Oglasi bendov za iskanje glasbenikov |
| `glasbenik_objava_like` | Like/dislike glasbenika na objavo |
| `bend_uporabnik_like` | Like/dislike benda na glasbenika |
| `Match` | Uspešni vzajemni matchi |

---

 API Končne točke

| Metoda | Pot | Opis | Zaščiteno |
|---|---|---|---|
| POST | `/api/auth/register` | Registracija glasbenika | ❌ |
| POST | `/api/auth/login` | Prijava | ❌ |
| GET | `/api/auth/me` | Podatki prijavljenega | ✅ |
| GET | `/api/band/moj` | Band prijavljenega | ✅ |
| POST | `/api/band` | Ustvarjanje benda | ✅ |
| POST | `/api/band/objava` | Objava benda | ✅ |
| GET | `/api/matching/objave-za-uporabnika/{id}` | Objave za glasbenika | ❌ |
| GET | `/api/matching/uporabniki-za-band/{id}` | Glasbeniki za band | ❌ |
| POST | `/api/matching/glasbenik-oceni-objavo` | Glasbenikov like/dislike | ❌ |
| POST | `/api/matching/band-oceni-uporabnika` | Bendov like/dislike | ❌ |
| GET | `/api/matching/moji-matchi/{id}` | Matchi glasbenika | ❌ |
| GET | `/api/matching/moji-matchi-band/{id}` | Matchi benda | ❌ |
| GET | `/api/kraji` | Seznam krajev | ❌ |

---

## 📸 Zaslonske slike
<img width="1917" height="867" alt="image" src="https://github.com/user-attachments/assets/b58d5b1c-b900-4597-847b-ceb1fc87a9c2" />
<img width="1899" height="873" alt="image" src="https://github.com/user-attachments/assets/5a7b1c1a-bcac-4db4-8b9a-ea51014c2655" />
<img width="1897" height="870" alt="image" src="https://github.com/user-attachments/assets/169584aa-324a-41a6-adba-da8892cb01de" />
<img width="1896" height="869" alt="image" src="https://github.com/user-attachments/assets/f678c87d-634e-4265-9c59-a3a355334401" />
<img width="1896" height="871" alt="image" src="https://github.com/user-attachments/assets/97f97321-fd53-4300-baff-ef5d22a3d93d" />



##  Avtor

**Mark Hrastnik & Martin Tuk**  
Šolski center Velenje — Elektro in računalniška šola  
2025/2026
