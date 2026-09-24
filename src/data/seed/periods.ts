import type { Period } from "@/lib/domain/types";
import { stamps } from "./meta";

const base = { status: "published" as const, ...stamps() };

export const periods: Period[] = [
  {
    ...base, id: "per-antiquity", order: 1, startYear: -600, endYear: 500,
    translations: {
      pt: { title: "Antiguidade", slug: "antiguidade", summary: "Dos pré-socráticos ao fim do mundo romano: o nascimento da filosofia como investigação racional.",
        events: ["Os pré-socráticos buscam o princípio (arché) da natureza", "Sócrates e o método dialógico em Atenas", "Fundação da Academia (c. 387 a.C.) e do Liceu (c. 335 a.C.)", "Escolas helenísticas: estoicismo, epicurismo, ceticismo"] },
      en: { title: "Antiquity", slug: "antiquity", summary: "From the Pre-Socratics to the end of the Roman world: the birth of philosophy as rational inquiry.",
        events: ["The Pre-Socratics seek the principle (arche) of nature", "Socrates and the dialogical method in Athens", "Founding of the Academy (c. 387 BCE) and the Lyceum (c. 335 BCE)", "Hellenistic schools: Stoicism, Epicureanism, Scepticism"] },
      fr: { title: "Antiquité", slug: "antiquite", summary: "Des présocratiques à la fin du monde romain : la naissance de la philosophie comme enquête rationnelle.",
        events: ["Les présocratiques cherchent le principe (archè) de la nature", "Socrate et la méthode dialogique à Athènes", "Fondation de l'Académie (v. 387 av. J.-C.) et du Lycée (v. 335 av. J.-C.)"] },
      de: { title: "Antike", slug: "antike", summary: "Von den Vorsokratikern bis zum Ende der römischen Welt: die Geburt der Philosophie als rationale Untersuchung.",
        events: ["Die Vorsokratiker suchen das Prinzip (Arché) der Natur", "Sokrates und die dialogische Methode in Athen", "Gründung der Akademie (ca. 387 v. Chr.) und des Lykeions (ca. 335 v. Chr.)"] },
    },
  },
  {
    ...base, id: "per-medieval", order: 2, startYear: 500, endYear: 1400,
    translations: {
      pt: { title: "Idade Média", slug: "idade-media", summary: "Fé e razão em diálogo: patrística, escolástica e a recepção de Aristóteles.",
        events: ["Agostinho e a síntese entre platonismo e cristianismo", "Filosofia islâmica e judaica: Avicena, Averróis, Maimônides", "Fundação das universidades (séc. XII–XIII)", "Tomás de Aquino e a escolástica aristotélica"] },
      en: { title: "Middle Ages", slug: "middle-ages", summary: "Faith and reason in dialogue: patristics, scholasticism and the reception of Aristotle.",
        events: ["Augustine and the synthesis of Platonism and Christianity", "Islamic and Jewish philosophy: Avicenna, Averroes, Maimonides", "Founding of the universities (12th–13th c.)", "Thomas Aquinas and Aristotelian scholasticism"] },
      fr: { title: "Moyen Âge", slug: "moyen-age", summary: "Foi et raison en dialogue : patristique, scolastique et réception d'Aristote.",
        events: ["Augustin et la synthèse du platonisme et du christianisme", "Fondation des universités (XIIe–XIIIe s.)", "Thomas d'Aquin et la scolastique aristotélicienne"] },
      de: { title: "Mittelalter", slug: "mittelalter", summary: "Glaube und Vernunft im Dialog: Patristik, Scholastik und die Aristoteles-Rezeption.",
        events: ["Augustinus und die Synthese von Platonismus und Christentum", "Gründung der Universitäten (12.–13. Jh.)", "Thomas von Aquin und die aristotelische Scholastik"] },
    },
  },
  {
    ...base, id: "per-renaissance", order: 3, startYear: 1400, endYear: 1600,
    translations: {
      pt: { title: "Renascimento", slug: "renascimento", summary: "Humanismo, redescoberta dos antigos e as primeiras rupturas com a escolástica.",
        events: ["Humanismo florentino e tradução dos diálogos de Platão", "Maquiavel e a autonomia do político", "Revolução copernicana (1543)", "Montaigne e o ceticismo dos Ensaios"] },
      en: { title: "Renaissance", slug: "renaissance", summary: "Humanism, the rediscovery of the ancients and the first ruptures with scholasticism.",
        events: ["Florentine humanism and the translation of Plato's dialogues", "Machiavelli and the autonomy of politics", "Copernican revolution (1543)", "Montaigne and the scepticism of the Essays"] },
      fr: { title: "Renaissance", slug: "renaissance", summary: "Humanisme, redécouverte des Anciens et premières ruptures avec la scolastique.",
        events: ["Humanisme florentin et traduction des dialogues de Platon", "Machiavel et l'autonomie du politique", "Révolution copernicienne (1543)"] },
      de: { title: "Renaissance", slug: "renaissance", summary: "Humanismus, Wiederentdeckung der Antike und erste Brüche mit der Scholastik.",
        events: ["Florentiner Humanismus und Übersetzung der platonischen Dialoge", "Machiavelli und die Autonomie des Politischen", "Kopernikanische Wende (1543)"] },
    },
  },
  {
    ...base, id: "per-modern", order: 4, startYear: 1600, endYear: 1800,
    translations: {
      pt: { title: "Modernidade", slug: "modernidade", summary: "Racionalismo, empirismo e Iluminismo: o sujeito e o método no centro da filosofia.",
        events: ["Descartes e o Discurso do Método (1637)", "Spinoza, Leibniz e o racionalismo continental", "Locke, Berkeley e Hume: o empirismo britânico", "Kant e a Crítica da Razão Pura (1781)"] },
      en: { title: "Modernity", slug: "modernity", summary: "Rationalism, empiricism and the Enlightenment: subject and method at the centre of philosophy.",
        events: ["Descartes and the Discourse on the Method (1637)", "Spinoza, Leibniz and continental rationalism", "Locke, Berkeley and Hume: British empiricism", "Kant and the Critique of Pure Reason (1781)"] },
      fr: { title: "Modernité", slug: "modernite", summary: "Rationalisme, empirisme et Lumières : le sujet et la méthode au centre de la philosophie.",
        events: ["Descartes et le Discours de la méthode (1637)", "Spinoza, Leibniz et le rationalisme continental", "Kant et la Critique de la raison pure (1781)"] },
      de: { title: "Neuzeit", slug: "neuzeit", summary: "Rationalismus, Empirismus und Aufklärung: Subjekt und Methode im Zentrum der Philosophie.",
        events: ["Descartes und der Discours de la méthode (1637)", "Spinoza, Leibniz und der kontinentale Rationalismus", "Kant und die Kritik der reinen Vernunft (1781)"] },
    },
  },
  {
    ...base, id: "per-19th", order: 5, startYear: 1800, endYear: 1900,
    translations: {
      pt: { title: "Século XIX", slug: "seculo-xix", summary: "Idealismo alemão, crítica social, existência e a suspeita sobre a razão.",
        events: ["Hegel e a Fenomenologia do Espírito (1807)", "Kierkegaard e a filosofia da existência", "Marx e a crítica da economia política", "Nietzsche e a genealogia da moral"] },
      en: { title: "19th Century", slug: "19th-century", summary: "German idealism, social critique, existence and the suspicion of reason.",
        events: ["Hegel and the Phenomenology of Spirit (1807)", "Kierkegaard and the philosophy of existence", "Marx and the critique of political economy", "Nietzsche and the genealogy of morals"] },
      fr: { title: "XIXe siècle", slug: "xixe-siecle", summary: "Idéalisme allemand, critique sociale, existence et soupçon envers la raison.",
        events: ["Hegel et la Phénoménologie de l'esprit (1807)", "Kierkegaard et la philosophie de l'existence", "Marx et la critique de l'économie politique"] },
      de: { title: "19. Jahrhundert", slug: "19-jahrhundert", summary: "Deutscher Idealismus, Gesellschaftskritik, Existenz und der Verdacht gegen die Vernunft.",
        events: ["Hegel und die Phänomenologie des Geistes (1807)", "Kierkegaard und die Existenzphilosophie", "Marx und die Kritik der politischen Ökonomie"] },
    },
  },
  {
    ...base, id: "per-20th", order: 6, startYear: 1900, endYear: 1980,
    translations: {
      pt: { title: "Século XX", slug: "seculo-xx", summary: "Fenomenologia, filosofia analítica, existencialismo e teoria crítica.",
        events: ["Husserl e as Investigações Lógicas (1900–01)", "Wittgenstein e o Tractatus (1921)", "Heidegger e Ser e Tempo (1927)", "Sartre, Beauvoir e o existencialismo do pós-guerra", "Arendt e a análise do totalitarismo"] },
      en: { title: "20th Century", slug: "20th-century", summary: "Phenomenology, analytic philosophy, existentialism and critical theory.",
        events: ["Husserl and the Logical Investigations (1900–01)", "Wittgenstein and the Tractatus (1921)", "Heidegger and Being and Time (1927)", "Sartre, Beauvoir and post-war existentialism", "Arendt and the analysis of totalitarianism"] },
      fr: { title: "XXe siècle", slug: "xxe-siecle", summary: "Phénoménologie, philosophie analytique, existentialisme et théorie critique.",
        events: ["Husserl et les Recherches logiques (1900–01)", "Heidegger et Être et Temps (1927)", "Sartre, Beauvoir et l'existentialisme d'après-guerre"] },
      de: { title: "20. Jahrhundert", slug: "20-jahrhundert", summary: "Phänomenologie, analytische Philosophie, Existentialismus und Kritische Theorie.",
        events: ["Husserl und die Logischen Untersuchungen (1900–01)", "Wittgenstein und der Tractatus (1921)", "Heidegger und Sein und Zeit (1927)"] },
    },
  },
  {
    ...base, id: "per-contemporary", order: 7, startYear: 1980, endYear: null,
    translations: {
      pt: { title: "Contemporânea", slug: "contemporanea", summary: "Pluralismo de métodos: filosofia da mente, ética aplicada, pós-estruturalismo e novas metafísicas.",
        events: ["Debates sobre consciência e inteligência artificial", "Ética aplicada: bioética, ética ambiental", "Teorias da justiça e do reconhecimento", "Retorno da metafísica na tradição analítica"] },
      en: { title: "Contemporary", slug: "contemporary", summary: "Plural methods: philosophy of mind, applied ethics, post-structuralism and new metaphysics.",
        events: ["Debates on consciousness and artificial intelligence", "Applied ethics: bioethics, environmental ethics", "Theories of justice and recognition", "Return of metaphysics in the analytic tradition"] },
      fr: { title: "Contemporaine", slug: "contemporaine", summary: "Pluralité des méthodes : philosophie de l'esprit, éthique appliquée, post-structuralisme et nouvelles métaphysiques.",
        events: ["Débats sur la conscience et l'intelligence artificielle", "Éthique appliquée : bioéthique, éthique environnementale"] },
      de: { title: "Gegenwart", slug: "gegenwart", summary: "Methodenpluralismus: Philosophie des Geistes, angewandte Ethik, Poststrukturalismus und neue Metaphysik.",
        events: ["Debatten über Bewusstsein und künstliche Intelligenz", "Angewandte Ethik: Bioethik, Umweltethik"] },
    },
  },
];
