# Henkaku & SDS Infrastructure

> **WORK IN PROGRESS** — This document may contain inaccuracies or incomplete information. Do not treat it as authoritative until verified. If you spot errors, please flag them.

> Full inventory of organizational and technical infrastructure, April 2026.

## Overview

### Organization Accounts

```mermaid
graph LR
    subgraph "Google Workspace"
        GW1["henkaku.center"]
        GW2["henkaku.org"]
        GW3["chibatech.dev"]
    end

    subgraph "Hosting & Infrastructure"
        GH["GitHub — henkaku-center org, Team plan"]
        VERCEL["Vercel — Pro plan"]
        DO["DigitalOcean — Joi's Team"]
        AWS["AWS — EC2 + S3"]
    end

    subgraph "Domains"
        UNKNOWN["??? — henkaku.center"]
        GODADDY["GoDaddy — chibatech.dev"]
    end

    subgraph "SDS Admissions"
        JOTFORM["Jotform"]
        SQSP["Squarespace"]
        FIREFLIES["Fireflies.ai"]
    end
```

### Services Map

```mermaid
graph TB
    subgraph "Compass — active development"
        ADMIN["admin.henkaku.center"]
        CHARTER["charter.henkaku.center"]
        COMPASS["compass.henkaku.center"]
        STUDENT["student.chibatech.dev"]
    end

    REGISTRY["registry.henkaku.center<br/><i>Shared backend API</i>"]

    ADMIN -->|JWT| REGISTRY
    CHARTER -->|JWT| REGISTRY
    COMPASS -->|JWT + SSE| REGISTRY
    STUDENT -->|JWT| REGISTRY

    REGISTRY --> PG["PostgreSQL 16"]
    REGISTRY --> S3["S3 backups"]
```

```mermaid
graph LR
    subgraph "Vercel — legacy/other"
        WEBSITE["www.henkaku.center"]
        OMISE["omise.henkaku.org"]
        COMMUNITY["community.henkaku.org"]
        NENGAJO["nengajo.henkaku.org"]
        TICKET["henkaku-ticket-frontend"]
        AUCTION["mono-auction-interface"]
    end

    subgraph "Other"
        SDS["sds.chibatech.dev — Squarespace"]
        MATHESAR["mathesar.ito.com — DigitalOcean"]
        WIKI["Henkaku Wiki — inactive"]
    end
```

---

## 1. Organization Accounts & Billing

### Google Workspace

| Workspace | Plan | Monthly cost | Billing | Admin |
|-----------|------|-------------|---------|-------|
| **henkaku.center** | Business Starter | 5,225 JPY | Visa ****0187 | Boris |
| **henkaku.org** | Business Starter | ~2,000 JPY | Visa ****0187 | Boris |
| **chibatech.dev** | Business Starter | 7,500 JPY | Visa ****0120 | Ira |

**henkaku.center users** (12):

| Name | Email | Role |
|------|-------|------|
| Boris Anthony | boris@henkaku.center | Super Admin |
| Daum Kim | daum@henkaku.center | Super Admin |
| Grisha Szep | grisha@henkaku.center | Super Admin |
| Ira Winder | ira@henkaku.center | Super Admin |
| Joi Ito | joi@henkaku.center | Super Admin |
| Miho Shinada | miho@henkaku.center | User Mgmt / Groups / Services Admin |
| Jess Sousa | jess@henkaku.center | User |
| Events | events@henkaku.center | Service account |
| Office | office@henkaku.center | Service account |
| VPN | vpn@henkaku.center | Service account |
| Wizard of Oz | wizard-of-oz@henkaku.center | Service account |
| YouTube | youtube@henkaku.center | Service account |

**henkaku.center groups**: admin@, billing@, compass@, events-admin@, help@, info@, noreply@, web-admin@, gairon@ (web3/AI概論), daniel@, events-deprecated@

**henkaku.org users** (4): admins@ (Super Admin), boris@ (Super Admin), crt@ (CRT), office@. **Group**: web-services@

### GitHub (`henkaku-center`)

| Plan | Monthly cost | Billing |
|------|-------------|---------|
| Team | ~$60 USD | Visa ****0187 |

| Login | Name | Role |
|-------|------|------|
| BorisAnthony | Boris Anthony | Owner |
| irawinder | Ira Winder | Owner |
| Joi | Joi Ito | Owner |
| GalRaz | | Owner |
| geeknees | Masumi Kawasaki | Owner |
| TatsuyaIshibe | Tatsuya Ishibe | Owner |
| batessamantha | | Owner |
| gszep | Grisha Szep | Member |
| AJamesPhillips | James Phillips | Member |
| cameronfreer | Cameron Freer | Member |
| josephausterweil | | Member |

### Vercel

| Plan | Monthly cost | Billing |
|------|-------------|---------|
| Pro | ~$80 USD | Visa ****0187 |

**Users**: borisanthony (Owner), geeknees (Owner), joiito (Owner), Ira Winder (Member)

**Projects**:

| Project | URL | Repo |
|---------|-----|------|
| cit-henkaku-org | www.henkaku.center | henkaku-center/henkaku-center-website |
| henkaku-omise | omise.henkaku.org | henkaku-center/omise-interface |
| henkaku-discord-landing | community.henkaku.org | henkaku-center/henkaku-discord-landing |
| henkaku-nengajo | nengajo.henkaku.org | henkaku-center/henkaku-nengajo-frontend |
| henkaku-ticket-frontend | henkaku-ticket-frontend.vercel.app | henkaku-center/henkaku-ticket-frontend |
| mono-auction-interface | mono-auction-interface.vercel.app | henkaku-center/mono-auction-interface |

### DigitalOcean

| Plan | Monthly cost | Billing |
|------|-------------|---------|
| Joi's Team | ~$36 USD | Visa ****0187 |

**Users**: BorisAnthony (Owner), kriti@centerofci.org (Owner), joi@ito.com (Member), mika-tanaka (Biller)

**Projects**: Mathesar (mathesar.ito.com), Henkaku Center Wiki (inactive)

### AWS

| Service | Resource | Purpose |
|---------|----------|---------|
| EC2 | `54.65.222.205` (ap-northeast-1) | Registry backend |
| S3 | `s3://registry-backups-chibatech` | Database backups |

### SDS Admissions Tools

| Service | Purpose |
|---------|---------|
| Jotform | Application forms |
| Squarespace | sds.chibatech.dev public website |
| Fireflies.ai | Meeting transcription |

---

## 2. Compass Architecture

The active development work — four frontend apps sharing one backend API.

```mermaid
graph TB
    subgraph "GitHub Pages (static hosting)"
        ADMIN["admin.henkaku.center<br/><i>Account portal + user mgmt</i>"]
        CHARTER["charter.henkaku.center<br/><i>Governance docs + voting</i>"]
        COMPASS["compass.henkaku.center<br/><i>Entity registry + network graph</i>"]
        STUDENT["student.chibatech.dev<br/><i>SDS student portal</i>"]
    end

    subgraph "AWS EC2 (54.65.222.205)"
        NGINX["Nginx<br/><i>SSL (Let's Encrypt), ports 80/443</i>"]
        API["FastAPI + Uvicorn<br/><i>registry.henkaku.center</i><br/><i>Port 8080</i>"]
        PG["PostgreSQL 16<br/><i>Port 5432 (internal)</i>"]
        UPLOADS["Uploads Volume<br/><i>Portraits, docs, attachments</i>"]
    end

    subgraph "External"
        S3["AWS S3<br/><i>s3://registry-backups-chibatech</i>"]
        CDN["jsDelivr / unpkg<br/><i>marked, mermaid, Three.js</i>"]
    end

    ADMIN -->|"REST + JWT"| NGINX
    CHARTER -->|"REST + JWT"| NGINX
    COMPASS -->|"REST + JWT + SSE"| NGINX
    STUDENT -->|"REST + JWT"| NGINX

    NGINX --> API
    API --> PG
    API --> UPLOADS
    API -->|"Backup"| S3

    CHARTER -.->|"CDN libs"| CDN
    COMPASS -.->|"CDN libs"| CDN
    STUDENT -.->|"CDN libs"| CDN
```

### Frontend Apps

| App | Domain | Repo | Pages root | Key features |
|-----|--------|------|-----------|--------------|
| Admin | admin.henkaku.center | henkaku-center/admin | `/` | Account settings, user list, invite codes |
| Charter | charter.henkaku.center | henkaku-center/charter | `/` | Versioned governance docs, amendment proposals, weighted voting |
| Compass | compass.henkaku.center | henkaku-center/compass | `/` | 16 entity types, relations, 3D force-directed graph, check-ins |
| Student | student.chibatech.dev | henkaku-center/student | `docs/` | Orientation, courses, calendar, milestones, IDP, auth-gated |

All frontends: **vanilla HTML/CSS/JS** — no build process, no frameworks. Deployed by `git push` to GitHub Pages.

### CDN Dependencies

| Library | Used by | Purpose |
|---------|---------|---------|
| marked.js | Charter, Compass, Student | Markdown rendering |
| mermaid.js | Compass, Student | Gantt charts, diagrams |
| Three.js + 3d-force-graph | Compass | 3D network visualization |
| jszip | Charter | PDF/ZIP export |
| diff.js | Charter | Change tracking visualization |

### Registry Backend

| Component | Technology | Details |
|-----------|-----------|---------|
| Framework | FastAPI + Uvicorn | Python 3.12, fully async |
| Database | PostgreSQL 16 | 19 Alembic migrations |
| ORM | SQLAlchemy 2.0 (async) | asyncpg driver |
| Auth | JWT (python-jose) | 30min access + 7d refresh tokens |
| Real-time | SSE (sse-starlette) | Entity/relation change broadcasts |
| Rate limiting | slowapi | By X-Real-IP |
| Containers | Docker Compose | 3 services: api, db, nginx |
| SSL | Nginx + Let's Encrypt | Auto-renewed certs |
| Backups | S3 | `s3://registry-backups-chibatech` |

### API Surface

```mermaid
graph LR
    subgraph "Registry API — /api/v1"
        AUTH["/auth<br/>login, register, refresh,<br/>users, invite-codes"]
        DOCS["/charter/documents<br/>versioned markdown"]
        PROP["/charter/proposals<br/>amendments + voting"]
        STAKE["/charter/stakeholders<br/>governance participants"]
        ENT["/compass/entities<br/>CRUD, 16 entity types"]
        REL["/compass/relations<br/>entity-to-entity links"]
        FILES["/compass/files<br/>static docs + reference"]
        CHECK["/compass/checkins<br/>health tracking"]
        ETYPES["/compass/entity-types<br/>schemas + templates"]
        FEED["/feedback<br/>bug reports + features"]
        IDP["/idp<br/>individual dev plans"]
        ACT["/activity<br/>audit log"]
        SSE["/compass/events<br/>real-time SSE stream"]
    end

    ADMIN2["Admin"] --> AUTH
    CHARTER2["Charter"] --> AUTH & DOCS & PROP & STAKE & FILES & FEED
    COMPASS2["Compass"] --> AUTH & ENT & REL & FILES & CHECK & ETYPES & FEED & SSE
    STUDENT2["Student"] --> AUTH & ENT & REL & IDP
```

### Data Model

#### Identity & Compass

```mermaid
erDiagram
    users {
        uuid id PK
        string email UK
        string role "admin | content_manager | full_view | public_view"
        array stakeholder_types "director | faculty | staff | ..."
        uuid compass_entity_id FK "nullable 1-to-1"
    }
    compass_entities {
        string id PK "type-prefixed eg per_ proj_"
        string type "16 types"
        string name
        json data "merged on PATCH"
        string visibility "public | internal | restricted"
    }
    compass_relations {
        uuid id PK
        string source_id FK
        string target_id FK
        string type "has_member teaches etc"
    }
    checkins {
        uuid id PK
        string entity_id FK
        uuid user_id FK
        text note
    }
    entity_access_grants {
        uuid id PK
        string entity_id FK
        uuid user_id FK
        string level "view | edit"
    }

    users ||--o| compass_entities : "linked profile"
    compass_relations }o--|| compass_entities : "source"
    compass_relations }o--|| compass_entities : "target"
    checkins }o--|| compass_entities : "entity"
    checkins }o--|| users : "author"
    entity_access_grants }o--|| compass_entities : "entity"
    entity_access_grants }o--|| users : "grantee"
```

#### Charter & Governance

```mermaid
erDiagram
    document_heads {
        uuid id PK
        string doc_type "charter | governance"
        string latest_version_id FK
    }
    document_versions {
        uuid id PK
        string content_hash FK
        uuid parent_id FK
        uuid author_id FK
    }
    content_blobs {
        string hash PK "SHA-256 12-char"
        text content
    }
    proposals {
        uuid id PK
        uuid author_id FK
        string status "draft | active | passed | failed"
        timestamp voting_ends_at
    }

    document_heads ||--|| document_versions : "latest"
    document_versions }o--|| content_blobs : "content"
    document_versions }o--o| document_versions : "parent"
```

#### Supporting Tables

```mermaid
erDiagram
    feedback {
        uuid id PK
        uuid author_id FK
        string project
        string type "bug | feature | other"
    }
    idp_documents {
        uuid id PK
        uuid student_id FK
        uuid advisor_id FK
    }
    activity_log {
        uuid id PK
        uuid user_id FK
        string action
        json details
    }
```

### Entity Types

```mermaid
mindmap
  root((Compass<br/>Entities))
    People & Orgs
      person
      institution
    Academic
      course
      curriculum
      thesis
    Work
      project
      initiative
    Knowledge
      domain
      publication
      post
    Events & Places
      event
      place
    Transformation
      vector
      delta
```

---

## 3. Deployment

```mermaid
flowchart LR
    subgraph "Frontends (all 4 apps)"
        DEV1["Local dev<br/>(python -m http.server)"]
        GIT1["git push to GitHub"]
        GP["GitHub Pages<br/>auto-deploys"]
        DEV1 --> GIT1 --> GP
    end

    subgraph "Registry Backend"
        DEV2["Local dev<br/>(uvicorn --reload)"]
        SCP["scp to EC2"]
        DOCKER["docker compose<br/>up -d --build"]
        MIGRATE["alembic upgrade head"]
        DEV2 --> SCP --> DOCKER --> MIGRATE
    end
```

- **No CI/CD** for any repo — all manual
- **No staging environment** — single production server
- **No build process** — frontends served as-is

---

## 4. Domain Inventory

| Domain | Registrar/Host | Points to | Purpose |
|--------|---------------|-----------|---------|
| henkaku.center | (Boris) | Google Workspace + subdomains | Primary org domain |
| admin.henkaku.center | GitHub Pages CNAME | henkaku-center/admin | Account portal |
| charter.henkaku.center | GitHub Pages CNAME | henkaku-center/charter | Governance |
| compass.henkaku.center | GitHub Pages CNAME | henkaku-center/compass | Entity registry |
| registry.henkaku.center | DNS → EC2 | 54.65.222.205 | Backend API |
| www.henkaku.center | Vercel | henkaku-center-website | Main website |
| henkaku.org | (Boris) | Google Workspace | Secondary org domain |
| omise.henkaku.org | Vercel | omise-interface | Omise |
| community.henkaku.org | Vercel | discord-landing | Discord |
| nengajo.henkaku.org | Vercel | nengajo-frontend | Nengajo |
| chibatech.dev | GoDaddy (Ira) | Google Workspace + subdomains | SDS domain |
| sds.chibatech.dev | Squarespace | Squarespace | SDS public website |
| student.chibatech.dev | GitHub Pages CNAME | henkaku-center/student | Student portal |
| mathesar.ito.com | DigitalOcean | Mathesar | Data tool |

---

## 5. Key Facts

- **Single auth system** — Registry JWT serves all four Compass Initiative apps
- **Unified identity** — User (login) ↔ CompassEntity (profile), linked via `compass_entity_id`
- **Role hierarchy** — `public_view` < `full_view` < `content_manager` < `admin`
- **Entity visibility** — `public` / `internal` / `restricted` with cascading relation filtering
- **Background jobs** — proposal auto-resolution every 30s (in-process, no queue)
- **Real-time** — SSE broadcasts entity/relation changes to Compass frontend
- **Vercel projects** are mostly legacy web3-era projects, not part of active Compass development
- **DigitalOcean** is underutilized — only Mathesar active, wiki inactive
