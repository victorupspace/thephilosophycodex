import type { Philosopher } from "@/lib/domain/types";
import { stamps } from "./meta";

const base = { status: "published" as const, portrait: null, sourceIds: ["src-sep", "src-copleston"], ...stamps() };

export const philosophers: Philosopher[] = [
  {
    ...base, id: "phi-socrates", featured: true, birthYear: -470, deathYear: -399, birthYearApprox: true, periodId: "per-antiquity", schoolIds: [], categoryIds: ["cat-ethics", "cat-epistemology"], influencedByIds: [],
    translations: {
      pt: { title: "Sócrates", slug: "socrates", summary: "Filósofo ateniense que fez da pergunta um método: examinar a vida, definir a virtude e reconhecer a própria ignorância.", areas: ["Ética", "Epistemologia"], keyIdeas: ["Só sei que nada sei", "A virtude é conhecimento", "O método dialógico (elenchus)", "Uma vida sem exame não vale a pena ser vivida"] },
      en: { title: "Socrates", slug: "socrates", summary: "Athenian philosopher who turned the question into a method: examining life, defining virtue and acknowledging one's own ignorance.", areas: ["Ethics", "Epistemology"], keyIdeas: ["I know that I know nothing", "Virtue is knowledge", "The dialogical method (elenchus)", "The unexamined life is not worth living"] },
      fr: { title: "Socrate", slug: "socrate", summary: "Philosophe athénien qui fit de la question une méthode : examiner la vie, définir la vertu et reconnaître sa propre ignorance.", areas: ["Éthique", "Épistémologie"] },
      de: { title: "Sokrates", slug: "sokrates", summary: "Athenischer Philosoph, der die Frage zur Methode machte: das Leben prüfen, die Tugend bestimmen und die eigene Unwissenheit anerkennen.", areas: ["Ethik", "Erkenntnistheorie"] },
    },
  },
  {
    ...base, id: "phi-plato", featured: true, birthYear: -428, deathYear: -348, birthYearApprox: true, periodId: "per-antiquity", schoolIds: ["sch-platonism"], categoryIds: ["cat-metaphysics", "cat-epistemology", "cat-political", "cat-ethics"], influencedByIds: ["phi-socrates"],
    translations: {
      pt: { title: "Platão", slug: "platao", summary: "Discípulo de Sócrates e fundador da Academia; autor dos diálogos que estabeleceram a teoria das Formas e a filosofia política clássica.", areas: ["Metafísica", "Epistemologia", "Filosofia Política"], keyIdeas: ["Teoria das Formas (Ideias)", "Alegoria da caverna", "Conhecimento como reminiscência", "A cidade justa e o rei-filósofo"] },
      en: { title: "Plato", slug: "plato", summary: "Student of Socrates and founder of the Academy; author of the dialogues that established the theory of Forms and classical political philosophy.", areas: ["Metaphysics", "Epistemology", "Political Philosophy"], keyIdeas: ["Theory of Forms (Ideas)", "Allegory of the cave", "Knowledge as recollection", "The just city and the philosopher-king"] },
      fr: { title: "Platon", slug: "platon", summary: "Disciple de Socrate et fondateur de l'Académie ; auteur des dialogues qui établirent la théorie des Formes et la philosophie politique classique.", areas: ["Métaphysique", "Épistémologie", "Philosophie politique"] },
      de: { title: "Platon", slug: "platon", summary: "Schüler des Sokrates und Gründer der Akademie; Autor der Dialoge, die die Ideenlehre und die klassische politische Philosophie begründeten.", areas: ["Metaphysik", "Erkenntnistheorie", "Politische Philosophie"] },
    },
  },
  {
    ...base, id: "phi-aristotle", featured: true, birthYear: -384, deathYear: -322, periodId: "per-antiquity", schoolIds: ["sch-aristotelianism"], categoryIds: ["cat-metaphysics", "cat-logic", "cat-ethics", "cat-political", "cat-science"], influencedByIds: ["phi-plato"],
    translations: {
      pt: { title: "Aristóteles", slug: "aristoteles", summary: "Fundador do Liceu e da lógica formal; sistematizou a metafísica da substância, a ética das virtudes e a investigação da natureza.", areas: ["Metafísica", "Lógica", "Ética", "Filosofia Política"], keyIdeas: ["Substância, forma e matéria", "As quatro causas", "Silogismo", "Virtude como meio-termo", "Eudaimonia"] },
      en: { title: "Aristotle", slug: "aristotle", summary: "Founder of the Lyceum and of formal logic; systematised the metaphysics of substance, virtue ethics and the investigation of nature.", areas: ["Metaphysics", "Logic", "Ethics", "Political Philosophy"], keyIdeas: ["Substance, form and matter", "The four causes", "Syllogism", "Virtue as the mean", "Eudaimonia"] },
      fr: { title: "Aristote", slug: "aristote", summary: "Fondateur du Lycée et de la logique formelle ; il systématisa la métaphysique de la substance, l'éthique des vertus et l'étude de la nature.", areas: ["Métaphysique", "Logique", "Éthique"] },
      de: { title: "Aristoteles", slug: "aristoteles", summary: "Gründer des Lykeions und der formalen Logik; systematisierte die Substanzmetaphysik, die Tugendethik und die Naturforschung.", areas: ["Metaphysik", "Logik", "Ethik"] },
    },
  },
  {
    ...base, id: "phi-zeno", birthYear: -334, deathYear: -262, birthYearApprox: true, periodId: "per-antiquity", schoolIds: ["sch-stoicism"], categoryIds: ["cat-ethics", "cat-logic"], influencedByIds: ["phi-socrates"],
    translations: {
      pt: { title: "Zenão de Cítio", slug: "zenao-de-citio", summary: "Fundador do estoicismo, ensinou no Pórtico Pintado (Stoa) de Atenas.", areas: ["Ética", "Lógica"], keyIdeas: ["Viver conforme a natureza", "Virtude como único bem"] },
      en: { title: "Zeno of Citium", slug: "zeno-of-citium", summary: "Founder of Stoicism; taught at the Painted Porch (Stoa) in Athens.", areas: ["Ethics", "Logic"], keyIdeas: ["Living according to nature", "Virtue as the only good"] },
      fr: { title: "Zénon de Kition", slug: "zenon-de-kition", summary: "Fondateur du stoïcisme ; il enseigna sous le Portique peint (Stoa) d'Athènes.", areas: ["Éthique", "Logique"] },
      de: { title: "Zenon von Kition", slug: "zenon-von-kition", summary: "Begründer des Stoizismus; lehrte in der Bemalten Halle (Stoa) in Athen.", areas: ["Ethik", "Logik"] },
    },
  },
  {
    ...base, id: "phi-epicurus", featured: true, birthYear: -341, deathYear: -270, periodId: "per-antiquity", schoolIds: ["sch-epicureanism"], categoryIds: ["cat-ethics", "cat-metaphysics"], influencedByIds: [],
    translations: {
      pt: { title: "Epicuro", slug: "epicuro", summary: "Fundador do Jardim; defendeu uma física atomista e uma ética do prazer moderado e da ausência de perturbação.", areas: ["Ética", "Metafísica"], keyIdeas: ["Ataraxia", "O tetrapharmakos", "A morte não é nada para nós", "Atomismo"] },
      en: { title: "Epicurus", slug: "epicurus", summary: "Founder of the Garden; defended an atomist physics and an ethics of moderate pleasure and freedom from disturbance.", areas: ["Ethics", "Metaphysics"], keyIdeas: ["Ataraxia", "The tetrapharmakos", "Death is nothing to us", "Atomism"] },
      fr: { title: "Épicure", slug: "epicure", summary: "Fondateur du Jardin ; il défendit une physique atomiste et une éthique du plaisir modéré et de l'absence de trouble.", areas: ["Éthique", "Métaphysique"] },
      de: { title: "Epikur", slug: "epikur", summary: "Gründer des Gartens; vertrat eine atomistische Physik und eine Ethik maßvoller Lust und Unerschütterlichkeit.", areas: ["Ethik", "Metaphysik"] },
    },
  },
  {
    ...base, id: "phi-augustine", featured: true, birthYear: 354, deathYear: 430, periodId: "per-medieval", schoolIds: ["sch-platonism"], categoryIds: ["cat-religion", "cat-metaphysics", "cat-ethics", "cat-history"], influencedByIds: ["phi-plato"],
    translations: {
      pt: { title: "Agostinho de Hipona", slug: "agostinho", summary: "Bispo e teólogo que uniu platonismo e cristianismo; refletiu sobre o tempo, a vontade, o mal e a interioridade.", areas: ["Filosofia da Religião", "Metafísica", "Ética"], keyIdeas: ["Interioridade e busca de Deus", "O tempo como distensão da alma", "O mal como privação do bem", "A cidade de Deus e a cidade dos homens"] },
      en: { title: "Augustine of Hippo", slug: "augustine", summary: "Bishop and theologian who united Platonism and Christianity; reflected on time, will, evil and interiority.", areas: ["Philosophy of Religion", "Metaphysics", "Ethics"], keyIdeas: ["Interiority and the search for God", "Time as distension of the soul", "Evil as privation of good", "The City of God and the earthly city"] },
      fr: { title: "Augustin d'Hippone", slug: "augustin", summary: "Évêque et théologien qui unit platonisme et christianisme ; il réfléchit sur le temps, la volonté, le mal et l'intériorité.", areas: ["Philosophie de la religion", "Métaphysique"] },
      de: { title: "Augustinus von Hippo", slug: "augustinus", summary: "Bischof und Theologe, der Platonismus und Christentum verband; dachte über Zeit, Willen, das Böse und Innerlichkeit nach.", areas: ["Religionsphilosophie", "Metaphysik"] },
    },
  },
  {
    ...base, id: "phi-aquinas", featured: true, birthYear: 1225, deathYear: 1274, periodId: "per-medieval", schoolIds: ["sch-scholasticism", "sch-aristotelianism"], categoryIds: ["cat-religion", "cat-metaphysics", "cat-ethics"], influencedByIds: ["phi-aristotle", "phi-augustine"],
    translations: {
      pt: { title: "Tomás de Aquino", slug: "tomas-de-aquino", summary: "Dominicano que sintetizou Aristóteles e a teologia cristã na Suma Teológica; distinguiu razão e fé sem opô-las.", areas: ["Filosofia da Religião", "Metafísica", "Ética"], keyIdeas: ["As cinco vias", "Distinção entre essência e existência", "Lei natural", "Analogia do ser"] },
      en: { title: "Thomas Aquinas", slug: "thomas-aquinas", summary: "Dominican who synthesised Aristotle and Christian theology in the Summa Theologiae; distinguished reason and faith without opposing them.", areas: ["Philosophy of Religion", "Metaphysics", "Ethics"], keyIdeas: ["The Five Ways", "Distinction between essence and existence", "Natural law", "Analogy of being"] },
      fr: { title: "Thomas d'Aquin", slug: "thomas-d-aquin", summary: "Dominicain qui synthétisa Aristote et la théologie chrétienne dans la Somme théologique.", areas: ["Philosophie de la religion", "Métaphysique"] },
      de: { title: "Thomas von Aquin", slug: "thomas-von-aquin", summary: "Dominikaner, der Aristoteles und christliche Theologie in der Summa theologiae verband.", areas: ["Religionsphilosophie", "Metaphysik"] },
    },
  },
  {
    ...base, id: "phi-descartes", featured: true, birthYear: 1596, deathYear: 1650, periodId: "per-modern", schoolIds: ["sch-rationalism"], categoryIds: ["cat-epistemology", "cat-metaphysics", "cat-mind", "cat-science"], influencedByIds: ["phi-augustine", "phi-aristotle"],
    translations: {
      pt: { title: "René Descartes", slug: "rene-descartes", summary: "Pai da filosofia moderna: a dúvida metódica, o cogito e o dualismo entre pensamento e extensão.", areas: ["Epistemologia", "Metafísica", "Filosofia da Mente"], keyIdeas: ["Penso, logo existo", "Dúvida metódica", "Dualismo substancial", "Ideias claras e distintas"] },
      en: { title: "René Descartes", slug: "rene-descartes", summary: "Father of modern philosophy: methodical doubt, the cogito and the dualism of thought and extension.", areas: ["Epistemology", "Metaphysics", "Philosophy of Mind"], keyIdeas: ["I think, therefore I am", "Methodical doubt", "Substance dualism", "Clear and distinct ideas"] },
      fr: { title: "René Descartes", slug: "rene-descartes", summary: "Père de la philosophie moderne : le doute méthodique, le cogito et le dualisme de la pensée et de l'étendue.", areas: ["Épistémologie", "Métaphysique", "Philosophie de l'esprit"], keyIdeas: ["Je pense, donc je suis", "Doute méthodique", "Dualisme des substances"] },
      de: { title: "René Descartes", slug: "rene-descartes", summary: "Vater der modernen Philosophie: methodischer Zweifel, das Cogito und der Dualismus von Denken und Ausdehnung.", areas: ["Erkenntnistheorie", "Metaphysik", "Philosophie des Geistes"] },
    },
  },
  {
    ...base, id: "phi-spinoza", featured: true, birthYear: 1632, deathYear: 1677, periodId: "per-modern", schoolIds: ["sch-rationalism"], categoryIds: ["cat-metaphysics", "cat-ethics", "cat-political"], influencedByIds: ["phi-descartes"],
    translations: {
      pt: { title: "Baruch Spinoza", slug: "baruch-spinoza", summary: "Racionalista que identificou Deus e Natureza numa única substância; sua Ética deduz a liberdade da compreensão da necessidade.", areas: ["Metafísica", "Ética", "Filosofia Política"], keyIdeas: ["Deus sive Natura", "Substância única e infinita", "Conatus", "Liberdade como compreensão da necessidade"] },
      en: { title: "Baruch Spinoza", slug: "baruch-spinoza", summary: "Rationalist who identified God and Nature in a single substance; his Ethics derives freedom from the understanding of necessity.", areas: ["Metaphysics", "Ethics", "Political Philosophy"], keyIdeas: ["Deus sive Natura", "One infinite substance", "Conatus", "Freedom as understanding of necessity"] },
      fr: { title: "Baruch Spinoza", slug: "baruch-spinoza", summary: "Rationaliste qui identifia Dieu et la Nature en une substance unique ; son Éthique déduit la liberté de la compréhension de la nécessité.", areas: ["Métaphysique", "Éthique"] },
      de: { title: "Baruch de Spinoza", slug: "baruch-spinoza", summary: "Rationalist, der Gott und Natur in einer einzigen Substanz identifizierte; seine Ethik leitet Freiheit aus dem Verstehen der Notwendigkeit ab.", areas: ["Metaphysik", "Ethik"] },
    },
  },
  {
    ...base, id: "phi-hume", birthYear: 1711, deathYear: 1776, periodId: "per-modern", schoolIds: ["sch-empiricism"], categoryIds: ["cat-epistemology", "cat-ethics", "cat-religion"], influencedByIds: [],
    translations: {
      pt: { title: "David Hume", slug: "david-hume", summary: "Empirista escocês que levou a experiência ao limite: crítica da causalidade, da indução e do eu substancial.", areas: ["Epistemologia", "Ética"], keyIdeas: ["Impressões e ideias", "Problema da indução", "Causalidade como hábito", "A razão é escrava das paixões"] },
      en: { title: "David Hume", slug: "david-hume", summary: "Scottish empiricist who pushed experience to its limit: critique of causality, induction and the substantial self.", areas: ["Epistemology", "Ethics"], keyIdeas: ["Impressions and ideas", "The problem of induction", "Causality as habit", "Reason is the slave of the passions"] },
      fr: { title: "David Hume", slug: "david-hume", summary: "Empiriste écossais qui poussa l'expérience à sa limite : critique de la causalité, de l'induction et du moi substantiel.", areas: ["Épistémologie", "Éthique"] },
      de: { title: "David Hume", slug: "david-hume", summary: "Schottischer Empirist, der die Erfahrung an ihre Grenze trieb: Kritik der Kausalität, der Induktion und des substantiellen Ich.", areas: ["Erkenntnistheorie", "Ethik"] },
    },
  },
  {
    ...base, id: "phi-kant", featured: true, birthYear: 1724, deathYear: 1804, periodId: "per-modern", schoolIds: ["sch-idealism"], categoryIds: ["cat-epistemology", "cat-ethics", "cat-metaphysics", "cat-aesthetics"], influencedByIds: ["phi-hume", "phi-descartes"],
    translations: {
      pt: { title: "Immanuel Kant", slug: "immanuel-kant", summary: "Autor das três Críticas; estabeleceu os limites da razão, a moral do dever e a autonomia do juízo estético.", areas: ["Epistemologia", "Ética", "Metafísica", "Estética"], keyIdeas: ["Revolução copernicana na filosofia", "Fenômeno e coisa em si", "Imperativo categórico", "Autonomia da vontade", "Juízo de gosto desinteressado"] },
      en: { title: "Immanuel Kant", slug: "immanuel-kant", summary: "Author of the three Critiques; established the limits of reason, the morality of duty and the autonomy of aesthetic judgement.", areas: ["Epistemology", "Ethics", "Metaphysics", "Aesthetics"], keyIdeas: ["Copernican revolution in philosophy", "Phenomenon and thing-in-itself", "Categorical imperative", "Autonomy of the will", "Disinterested judgement of taste"] },
      fr: { title: "Emmanuel Kant", slug: "emmanuel-kant", summary: "Auteur des trois Critiques ; il établit les limites de la raison, la morale du devoir et l'autonomie du jugement esthétique.", areas: ["Épistémologie", "Éthique", "Métaphysique", "Esthétique"], keyIdeas: ["Révolution copernicienne", "Phénomène et chose en soi", "Impératif catégorique"] },
      de: { title: "Immanuel Kant", slug: "immanuel-kant", summary: "Autor der drei Kritiken; bestimmte die Grenzen der Vernunft, die Pflichtmoral und die Autonomie des ästhetischen Urteils.", areas: ["Erkenntnistheorie", "Ethik", "Metaphysik", "Ästhetik"], keyIdeas: ["Kopernikanische Wende", "Erscheinung und Ding an sich", "Kategorischer Imperativ", "Autonomie des Willens"] },
    },
  },
  {
    ...base, id: "phi-hegel", featured: true, birthYear: 1770, deathYear: 1831, periodId: "per-19th", schoolIds: ["sch-idealism"], categoryIds: ["cat-metaphysics", "cat-history", "cat-political", "cat-social"], influencedByIds: ["phi-kant", "phi-spinoza", "phi-aristotle"],
    translations: {
      pt: { title: "G. W. F. Hegel", slug: "hegel", summary: "Idealista alemão que pensou a realidade como processo dialético do Espírito; a história como progresso da consciência da liberdade.", areas: ["Metafísica", "Filosofia da História", "Filosofia Política"], keyIdeas: ["Dialética", "Espírito absoluto", "Reconhecimento (senhor e escravo)", "O real é racional"] },
      en: { title: "G. W. F. Hegel", slug: "hegel", summary: "German idealist who conceived reality as the dialectical process of Spirit; history as the progress of the consciousness of freedom.", areas: ["Metaphysics", "Philosophy of History", "Political Philosophy"], keyIdeas: ["Dialectic", "Absolute Spirit", "Recognition (master and slave)", "The real is rational"] },
      fr: { title: "G. W. F. Hegel", slug: "hegel", summary: "Idéaliste allemand qui pensa la réalité comme processus dialectique de l'Esprit ; l'histoire comme progrès de la conscience de la liberté.", areas: ["Métaphysique", "Philosophie de l'histoire"] },
      de: { title: "G. W. F. Hegel", slug: "hegel", summary: "Deutscher Idealist, der die Wirklichkeit als dialektischen Prozess des Geistes dachte; Geschichte als Fortschritt im Bewusstsein der Freiheit.", areas: ["Metaphysik", "Geschichtsphilosophie"], keyIdeas: ["Dialektik", "Absoluter Geist", "Anerkennung (Herr und Knecht)"] },
    },
  },
  {
    ...base, id: "phi-kierkegaard", featured: true, birthYear: 1813, deathYear: 1855, periodId: "per-19th", schoolIds: ["sch-existentialism"], categoryIds: ["cat-ethics", "cat-religion"], influencedByIds: ["phi-hegel", "phi-socrates"],
    translations: {
      pt: { title: "Søren Kierkegaard", slug: "soren-kierkegaard", summary: "Pensador dinamarquês da existência singular: angústia, desespero, o salto da fé e os estádios da vida.", areas: ["Ética", "Filosofia da Religião"], keyIdeas: ["Angústia", "Salto da fé", "Estádios estético, ético e religioso", "A verdade é a subjetividade"] },
      en: { title: "Søren Kierkegaard", slug: "soren-kierkegaard", summary: "Danish thinker of singular existence: anxiety, despair, the leap of faith and the stages of life.", areas: ["Ethics", "Philosophy of Religion"], keyIdeas: ["Anxiety", "Leap of faith", "Aesthetic, ethical and religious stages", "Truth is subjectivity"] },
      fr: { title: "Søren Kierkegaard", slug: "soren-kierkegaard", summary: "Penseur danois de l'existence singulière : angoisse, désespoir, saut de la foi et stades de la vie.", areas: ["Éthique", "Philosophie de la religion"] },
      de: { title: "Søren Kierkegaard", slug: "soren-kierkegaard", summary: "Dänischer Denker der einzelnen Existenz: Angst, Verzweiflung, Sprung des Glaubens und Stadien des Lebens.", areas: ["Ethik", "Religionsphilosophie"] },
    },
  },
  {
    ...base, id: "phi-marx", featured: true, birthYear: 1818, deathYear: 1883, periodId: "per-19th", schoolIds: ["sch-marxism"], categoryIds: ["cat-political", "cat-social", "cat-history"], influencedByIds: ["phi-hegel"],
    translations: {
      pt: { title: "Karl Marx", slug: "karl-marx", summary: "Crítico da economia política; explicou a história pela luta de classes e o capitalismo pela exploração do trabalho.", areas: ["Filosofia Política", "Filosofia Social", "Filosofia da História"], keyIdeas: ["Materialismo histórico", "Alienação", "Mais-valia", "Luta de classes", "Ideologia"] },
      en: { title: "Karl Marx", slug: "karl-marx", summary: "Critic of political economy; explained history through class struggle and capitalism through the exploitation of labour.", areas: ["Political Philosophy", "Social Philosophy", "Philosophy of History"], keyIdeas: ["Historical materialism", "Alienation", "Surplus value", "Class struggle", "Ideology"] },
      fr: { title: "Karl Marx", slug: "karl-marx", summary: "Critique de l'économie politique ; il expliqua l'histoire par la lutte des classes et le capitalisme par l'exploitation du travail.", areas: ["Philosophie politique", "Philosophie sociale"] },
      de: { title: "Karl Marx", slug: "karl-marx", summary: "Kritiker der politischen Ökonomie; erklärte Geschichte durch Klassenkampf und den Kapitalismus durch Ausbeutung der Arbeit.", areas: ["Politische Philosophie", "Sozialphilosophie"] },
    },
  },
  {
    ...base, id: "phi-james", birthYear: 1842, deathYear: 1910, periodId: "per-19th", schoolIds: ["sch-pragmatism"], categoryIds: ["cat-epistemology", "cat-mind", "cat-religion"], influencedByIds: ["phi-hume"],
    translations: {
      pt: { title: "William James", slug: "william-james", summary: "Psicólogo e filósofo pragmatista; a verdade como aquilo que funciona na experiência.", areas: ["Epistemologia", "Filosofia da Mente"], keyIdeas: ["Pragmatismo", "Fluxo de consciência", "A vontade de crer"] },
      en: { title: "William James", slug: "william-james", summary: "Psychologist and pragmatist philosopher; truth as what works in experience.", areas: ["Epistemology", "Philosophy of Mind"], keyIdeas: ["Pragmatism", "Stream of consciousness", "The will to believe"] },
      fr: { title: "William James", slug: "william-james", summary: "Psychologue et philosophe pragmatiste ; la vérité comme ce qui fonctionne dans l'expérience.", areas: ["Épistémologie", "Philosophie de l'esprit"] },
      de: { title: "William James", slug: "william-james", summary: "Psychologe und pragmatistischer Philosoph; Wahrheit als das, was sich in der Erfahrung bewährt.", areas: ["Erkenntnistheorie", "Philosophie des Geistes"] },
    },
  },
  {
    ...base, id: "phi-nietzsche", featured: true, birthYear: 1844, deathYear: 1900, periodId: "per-19th", schoolIds: [], categoryIds: ["cat-ethics", "cat-metaphysics", "cat-aesthetics"], influencedByIds: ["phi-kant", "phi-epicurus"],
    translations: {
      pt: { title: "Friedrich Nietzsche", slug: "friedrich-nietzsche", summary: "Crítico da moral e da metafísica ocidentais; genealogia dos valores, vontade de potência e eterno retorno.", areas: ["Ética", "Metafísica", "Estética"], keyIdeas: ["Deus está morto", "Vontade de potência", "Eterno retorno", "Genealogia da moral", "Além-do-homem"] },
      en: { title: "Friedrich Nietzsche", slug: "friedrich-nietzsche", summary: "Critic of Western morality and metaphysics; genealogy of values, will to power and eternal recurrence.", areas: ["Ethics", "Metaphysics", "Aesthetics"], keyIdeas: ["God is dead", "Will to power", "Eternal recurrence", "Genealogy of morals", "Übermensch"] },
      fr: { title: "Friedrich Nietzsche", slug: "friedrich-nietzsche", summary: "Critique de la morale et de la métaphysique occidentales ; généalogie des valeurs, volonté de puissance et éternel retour.", areas: ["Éthique", "Métaphysique", "Esthétique"] },
      de: { title: "Friedrich Nietzsche", slug: "friedrich-nietzsche", summary: "Kritiker der abendländischen Moral und Metaphysik; Genealogie der Werte, Wille zur Macht und ewige Wiederkunft.", areas: ["Ethik", "Metaphysik", "Ästhetik"], keyIdeas: ["Gott ist tot", "Wille zur Macht", "Ewige Wiederkunft", "Genealogie der Moral", "Übermensch"] },
    },
  },
  {
    ...base, id: "phi-husserl", birthYear: 1859, deathYear: 1938, periodId: "per-20th", schoolIds: ["sch-phenomenology"], categoryIds: ["cat-epistemology", "cat-mind", "cat-logic"], influencedByIds: ["phi-descartes", "phi-kant"],
    translations: {
      pt: { title: "Edmund Husserl", slug: "edmund-husserl", summary: "Fundador da fenomenologia: voltar às coisas mesmas pela descrição da consciência intencional.", areas: ["Epistemologia", "Filosofia da Mente", "Lógica"], keyIdeas: ["Intencionalidade", "Redução fenomenológica (epoché)", "Mundo da vida (Lebenswelt)"] },
      en: { title: "Edmund Husserl", slug: "edmund-husserl", summary: "Founder of phenomenology: back to the things themselves through the description of intentional consciousness.", areas: ["Epistemology", "Philosophy of Mind", "Logic"], keyIdeas: ["Intentionality", "Phenomenological reduction (epoché)", "Lifeworld (Lebenswelt)"] },
      fr: { title: "Edmund Husserl", slug: "edmund-husserl", summary: "Fondateur de la phénoménologie : retour aux choses mêmes par la description de la conscience intentionnelle.", areas: ["Épistémologie", "Philosophie de l'esprit"] },
      de: { title: "Edmund Husserl", slug: "edmund-husserl", summary: "Begründer der Phänomenologie: zu den Sachen selbst durch die Beschreibung des intentionalen Bewusstseins.", areas: ["Erkenntnistheorie", "Philosophie des Geistes"], keyIdeas: ["Intentionalität", "Phänomenologische Reduktion (Epoché)", "Lebenswelt"] },
    },
  },
  {
    ...base, id: "phi-heidegger", featured: true, birthYear: 1889, deathYear: 1976, periodId: "per-20th", schoolIds: ["sch-phenomenology", "sch-existentialism"], categoryIds: ["cat-metaphysics", "cat-mind", "cat-language"], influencedByIds: ["phi-husserl", "phi-kierkegaard", "phi-nietzsche", "phi-aristotle"],
    translations: {
      pt: { title: "Martin Heidegger", slug: "martin-heidegger", summary: "Recolocou a questão do sentido do ser; analisou o Dasein como ser-no-mundo, temporalidade e ser-para-a-morte.", areas: ["Metafísica", "Filosofia da Mente", "Filosofia da Linguagem"], keyIdeas: ["Questão do ser", "Dasein e ser-no-mundo", "Ser-para-a-morte", "A linguagem é a casa do ser"] },
      en: { title: "Martin Heidegger", slug: "martin-heidegger", summary: "Reopened the question of the meaning of being; analysed Dasein as being-in-the-world, temporality and being-towards-death.", areas: ["Metaphysics", "Philosophy of Mind", "Philosophy of Language"], keyIdeas: ["The question of being", "Dasein and being-in-the-world", "Being-towards-death", "Language is the house of being"] },
      fr: { title: "Martin Heidegger", slug: "martin-heidegger", summary: "Il reposa la question du sens de l'être ; analysa le Dasein comme être-au-monde, temporalité et être-pour-la-mort.", areas: ["Métaphysique", "Philosophie du langage"] },
      de: { title: "Martin Heidegger", slug: "martin-heidegger", summary: "Stellte die Frage nach dem Sinn von Sein neu; analysierte das Dasein als In-der-Welt-sein, Zeitlichkeit und Sein zum Tode.", areas: ["Metaphysik", "Sprachphilosophie"], keyIdeas: ["Seinsfrage", "Dasein und In-der-Welt-sein", "Sein zum Tode", "Die Sprache ist das Haus des Seins"] },
    },
  },
  {
    ...base, id: "phi-wittgenstein", featured: true, birthYear: 1889, deathYear: 1951, periodId: "per-20th", schoolIds: [], categoryIds: ["cat-language", "cat-logic", "cat-mind"], influencedByIds: ["phi-kant", "phi-kierkegaard"],
    translations: {
      pt: { title: "Ludwig Wittgenstein", slug: "ludwig-wittgenstein", summary: "Do Tractatus às Investigações Filosóficas: os limites da linguagem, os jogos de linguagem e o significado como uso.", areas: ["Filosofia da Linguagem", "Lógica", "Filosofia da Mente"], keyIdeas: ["Os limites da minha linguagem são os limites do meu mundo", "Jogos de linguagem", "Significado como uso", "Argumento da linguagem privada"] },
      en: { title: "Ludwig Wittgenstein", slug: "ludwig-wittgenstein", summary: "From the Tractatus to the Philosophical Investigations: the limits of language, language-games and meaning as use.", areas: ["Philosophy of Language", "Logic", "Philosophy of Mind"], keyIdeas: ["The limits of my language are the limits of my world", "Language-games", "Meaning as use", "Private language argument"] },
      fr: { title: "Ludwig Wittgenstein", slug: "ludwig-wittgenstein", summary: "Du Tractatus aux Recherches philosophiques : les limites du langage, les jeux de langage et la signification comme usage.", areas: ["Philosophie du langage", "Logique"] },
      de: { title: "Ludwig Wittgenstein", slug: "ludwig-wittgenstein", summary: "Vom Tractatus zu den Philosophischen Untersuchungen: die Grenzen der Sprache, Sprachspiele und Bedeutung als Gebrauch.", areas: ["Sprachphilosophie", "Logik"], keyIdeas: ["Die Grenzen meiner Sprache bedeuten die Grenzen meiner Welt", "Sprachspiele", "Bedeutung als Gebrauch"] },
    },
  },
  {
    ...base, id: "phi-sartre", featured: true, birthYear: 1905, deathYear: 1980, periodId: "per-20th", schoolIds: ["sch-existentialism", "sch-phenomenology"], categoryIds: ["cat-ethics", "cat-metaphysics", "cat-political"], influencedByIds: ["phi-husserl", "phi-heidegger", "phi-hegel", "phi-marx"],
    translations: {
      pt: { title: "Jean-Paul Sartre", slug: "jean-paul-sartre", summary: "Existencialista francês: o homem está condenado a ser livre; a existência precede a essência.", areas: ["Ética", "Metafísica", "Filosofia Política"], keyIdeas: ["A existência precede a essência", "Condenado a ser livre", "Má-fé", "Em-si e para-si", "O olhar do outro"] },
      en: { title: "Jean-Paul Sartre", slug: "jean-paul-sartre", summary: "French existentialist: man is condemned to be free; existence precedes essence.", areas: ["Ethics", "Metaphysics", "Political Philosophy"], keyIdeas: ["Existence precedes essence", "Condemned to be free", "Bad faith", "In-itself and for-itself", "The gaze of the other"] },
      fr: { title: "Jean-Paul Sartre", slug: "jean-paul-sartre", summary: "Existentialiste français : l'homme est condamné à être libre ; l'existence précède l'essence.", areas: ["Éthique", "Métaphysique", "Philosophie politique"], keyIdeas: ["L'existence précède l'essence", "Condamné à être libre", "Mauvaise foi", "En-soi et pour-soi"] },
      de: { title: "Jean-Paul Sartre", slug: "jean-paul-sartre", summary: "Französischer Existentialist: Der Mensch ist zur Freiheit verurteilt; die Existenz geht der Essenz voraus.", areas: ["Ethik", "Metaphysik"] },
    },
  },
  {
    ...base, id: "phi-arendt", featured: true, birthYear: 1906, deathYear: 1975, periodId: "per-20th", schoolIds: ["sch-phenomenology"], categoryIds: ["cat-political", "cat-social", "cat-history"], influencedByIds: ["phi-heidegger", "phi-kant", "phi-augustine", "phi-aristotle"],
    translations: {
      pt: { title: "Hannah Arendt", slug: "hannah-arendt", summary: "Pensadora política do totalitarismo, da ação e da condição humana; cunhou a expressão 'banalidade do mal'.", areas: ["Filosofia Política", "Filosofia Social", "Filosofia da História"], keyIdeas: ["Banalidade do mal", "Ação, trabalho e obra", "Natalidade", "Totalitarismo", "O direito a ter direitos"] },
      en: { title: "Hannah Arendt", slug: "hannah-arendt", summary: "Political thinker of totalitarianism, action and the human condition; coined the phrase 'banality of evil'.", areas: ["Political Philosophy", "Social Philosophy", "Philosophy of History"], keyIdeas: ["Banality of evil", "Labour, work and action", "Natality", "Totalitarianism", "The right to have rights"] },
      fr: { title: "Hannah Arendt", slug: "hannah-arendt", summary: "Penseuse politique du totalitarisme, de l'action et de la condition humaine ; elle forgea l'expression « banalité du mal ».", areas: ["Philosophie politique", "Philosophie sociale"] },
      de: { title: "Hannah Arendt", slug: "hannah-arendt", summary: "Politische Denkerin des Totalitarismus, des Handelns und der Vita activa; prägte den Ausdruck „Banalität des Bösen“.", areas: ["Politische Philosophie", "Sozialphilosophie"], keyIdeas: ["Banalität des Bösen", "Arbeiten, Herstellen, Handeln", "Natalität", "Totalitarismus"] },
    },
  },
  {
    ...base, id: "phi-beauvoir", featured: true, birthYear: 1908, deathYear: 1986, periodId: "per-20th", schoolIds: ["sch-existentialism", "sch-phenomenology"], categoryIds: ["cat-ethics", "cat-social", "cat-political"], influencedByIds: ["phi-sartre", "phi-hegel", "phi-husserl"],
    translations: {
      pt: { title: "Simone de Beauvoir", slug: "simone-de-beauvoir", summary: "Existencialista e fundadora da filosofia feminista contemporânea: 'Não se nasce mulher, torna-se mulher.'", areas: ["Ética", "Filosofia Social", "Filosofia Política"], keyIdeas: ["Não se nasce mulher, torna-se mulher", "A mulher como Outro", "Ética da ambiguidade", "Liberdade situada"] },
      en: { title: "Simone de Beauvoir", slug: "simone-de-beauvoir", summary: "Existentialist and founder of contemporary feminist philosophy: 'One is not born, but rather becomes, a woman.'", areas: ["Ethics", "Social Philosophy", "Political Philosophy"], keyIdeas: ["One is not born, but becomes, a woman", "Woman as Other", "Ethics of ambiguity", "Situated freedom"] },
      fr: { title: "Simone de Beauvoir", slug: "simone-de-beauvoir", summary: "Existentialiste et fondatrice de la philosophie féministe contemporaine : « On ne naît pas femme, on le devient. »", areas: ["Éthique", "Philosophie sociale"], keyIdeas: ["On ne naît pas femme, on le devient", "La femme comme Autre", "Morale de l'ambiguïté"] },
      de: { title: "Simone de Beauvoir", slug: "simone-de-beauvoir", summary: "Existentialistin und Begründerin der zeitgenössischen feministischen Philosophie: „Man kommt nicht als Frau zur Welt, man wird es.“", areas: ["Ethik", "Sozialphilosophie"] },
    },
  },
  {
    ...base, id: "phi-comte", birthYear: 1798, deathYear: 1857, periodId: "per-19th", schoolIds: ["sch-positivism"], categoryIds: ["cat-science", "cat-social", "cat-history"], influencedByIds: ["phi-hume"],
    translations: {
      pt: { title: "Auguste Comte", slug: "auguste-comte", summary: "Fundador do positivismo e da sociologia; a lei dos três estados e a religião da humanidade.", areas: ["Filosofia da Ciência", "Filosofia Social"], keyIdeas: ["Lei dos três estados", "Hierarquia das ciências", "Sociologia como física social"] },
      en: { title: "Auguste Comte", slug: "auguste-comte", summary: "Founder of positivism and sociology; the law of three stages and the religion of humanity.", areas: ["Philosophy of Science", "Social Philosophy"], keyIdeas: ["Law of three stages", "Hierarchy of the sciences", "Sociology as social physics"] },
      fr: { title: "Auguste Comte", slug: "auguste-comte", summary: "Fondateur du positivisme et de la sociologie ; la loi des trois états et la religion de l'humanité.", areas: ["Philosophie des sciences", "Philosophie sociale"] },
      de: { title: "Auguste Comte", slug: "auguste-comte", summary: "Begründer des Positivismus und der Soziologie; das Dreistadiengesetz und die Religion der Menschheit.", areas: ["Wissenschaftstheorie", "Sozialphilosophie"] },
    },
  },
];
