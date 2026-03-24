# StudyBoard

Uma aplicação web moderna para gerenciamento de estudos e preparação para concursos públicos, desenvolvida como uma réplica pixel-perfect do StudyBoard original. Focada em organização de conteúdo, agendamento de eventos e acompanhamento de progresso.

## 🎯 Visão Geral

O StudyBoard é uma ferramenta completa para estudantes que se preparam para concursos públicos, especialmente o **ÊNFASE 7: CIÊNCIA DE DADOS**. A aplicação oferece uma interface intuitiva para organizar conteúdos de estudo, agendar sessões de estudo, trabalho e descanso, e acompanhar o progresso de aprendizado.

## ✨ Funcionalidades

### 📅 Calendário Interativo
- **Visualizações múltiplas**: Semana, Dia e Mês
- **Agendamento de eventos**: Estudo, Trabalho, Descanso, Questões e Eventos personalizados
- **Horário flexível**: 00:00 às 23:59
- **Interface drag-and-drop** para criação rápida de eventos

### 📚 Gerenciamento de Conteúdo
- **Estrutura hierárquica**: Conhecimentos → Áreas → Conteúdos → Subconteúdos
- **Organização por concurso**: Suporte para diferentes concursos públicos
- **Acompanhamento de progresso**: Status de não-iniciado, em progresso e concluído
- **Cores personalizadas** por área de conhecimento

### 🎨 Interface Moderna
- **Design pixel-perfect**: Réplica fiel do StudyBoard original
- **Tema escuro/claro**: Suporte completo a temas
- **Componentes acessíveis**: Construído com Radix UI
- **Responsivo**: Funciona perfeitamente em desktop e mobile

### 🔧 Recursos Avançados
- **Modal de eventos inteligente**: Seleção de área, conteúdo e subconteúdos
- **Filtros e busca**: Localização rápida de conteúdos
- **Importação de dados**: Suporte a JSON estruturado
- **Estado persistente**: Dados salvos localmente

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca JavaScript para interfaces
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utilitário
- **Shadcn/ui** - Componentes UI baseados em Radix UI

### Gerenciamento de Estado
- **Zustand** - State management leve e poderoso
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas

### Utilitários
- **date-fns** - Manipulação de datas
- **Lucide React** - Ícones modernos
- **React Router** - Roteamento
- **React Query** - Gerenciamento de dados assíncronos

### Testes e Qualidade
- **Vitest** - Framework de testes
- **Playwright** - Testes end-to-end
- **ESLint** - Linting de código
- **TypeScript** - Verificação de tipos

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Passos de Instalação

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd studyboard-pixel-perfect-replica
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

4. **Acesse a aplicação**
   - Abra [http://localhost:5173](http://localhost:5173) no navegador

## 📖 Uso

### Primeiros Passos
1. A aplicação carrega automaticamente os dados de conteúdo do arquivo `public/conteudo.json`
2. Navegue entre as visualizações de calendário (Semana, Dia, Mês)
3. Clique em um slot de horário para criar um novo evento

### Criando Eventos
1. Clique em qualquer horário no calendário
2. Selecione o tipo de evento (Estudo, Trabalho, Descanso, Questões, Custom)
3. Para eventos de estudo/questões:
   - Escolha a área de conhecimento
   - Selecione o conteúdo específico
   - Marque os subconteúdos desejados
4. Defina horário de início e fim
5. Adicione notas opcionais

### Gerenciando Conteúdo
- Visualize o progresso em cada área
- Marque subconteúdos como concluídos
- Use filtros para encontrar conteúdos específicos

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── calendar/          # Componentes do calendário
│   │   ├── CalendarView.tsx
│   │   ├── WeekView.tsx
│   │   ├── DayView.tsx
│   │   ├── MonthView.tsx
│   │   └── EventBlock.tsx
│   ├── cards/             # Cards de conteúdo
│   │   ├── AreaCard.tsx
│   │   ├── ConteudoItem.tsx
│   │   └── ProgressBar.tsx
│   ├── layout/            # Layout da aplicação
│   │   ├── AppShell.tsx
│   │   ├── Sidebar.tsx
│   │   └── TopBar.tsx
│   ├── modals/            # Modais
│   │   ├── EventModal.tsx
│   │   └── ImportModal.tsx
│   └── ui/                # Componentes base UI
├── hooks/                 # Hooks customizados
│   ├── useCalendar.ts
│   └── use-mobile.tsx
├── lib/                   # Utilitários
│   └── utils.ts
├── pages/                 # Páginas da aplicação
│   ├── Index.tsx
│   └── NotFound.tsx
├── store/                 # Estado global (Zustand)
│   ├── useAgendaStore.ts
│   ├── useConteudoStore.ts
│   └── useUIStore.ts
├── types/                 # Definições TypeScript
│   └── index.ts
└── utils/                 # Utilitários específicos
    ├── colorMap.ts
    └── dateHelpers.ts
```

## 📜 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run build:dev` - Build para desenvolvimento
- `npm run preview` - Preview do build de produção
- `npm run test` - Executa testes unitários
- `npm run test:watch` - Executa testes em modo watch
- `npm run lint` - Executa linting do código

## 🧪 Testes

### Testes Unitários
```bash
npm run test
```

### Testes End-to-End
```bash
npx playwright test
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Diretrizes de Contribuição
- Siga os padrões de código estabelecidos
- Adicione testes para novas funcionalidades
- Mantenha a compatibilidade com o design pixel-perfect
- Documente mudanças significativas

## 📄 Licença

Este projeto é privado e confidencial. Todos os direitos reservados.
