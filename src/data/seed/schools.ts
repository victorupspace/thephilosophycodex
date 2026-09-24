import type { School } from "@/lib/domain/types";
import { stamps } from "./meta";

const base = { status: "published" as const, ...stamps() };

export const schools: School[] = [
  {
    ...base, id: "sch-stoicism", periodId: "per-antiquity", startYear: -300, endYear: 200, influencedByIds: ["sch-platonism"], relatedSchoolIds: ["sch-epicureanism"],
    translations: {
      pt: { title: "Estoicismo", slug: "estoicismo", summary: "Escola helenística fundada por Zenão de Cítio: viver segundo a natureza e a razão, distinguindo o que depende de nós do que não depende.", definition: "Corrente filosófica helenística que identifica a virtude com a vida conforme à razão e à natureza, cultivando a indiferença diante do que não está em nosso poder." },
      en: { title: "Stoicism", slug: "stoicism", summary: "Hellenistic school founded by Zeno of Citium: living according to nature and reason, distinguishing what depends on us from what does not.", definition: "Hellenistic philosophical current that identifies virtue with life in accordance with reason and nature, cultivating indifference towards what is not in our power." },
      fr: { title: "Stoïcisme", slug: "stoicisme", summary: "École hellénistique fondée par Zénon de Kition : vivre selon la nature et la raison, en distinguant ce qui dépend de nous de ce qui n'en dépend pas.", definition: "Courant philosophique hellénistique qui identifie la vertu à la vie conforme à la raison et à la nature." },
      de: { title: "Stoizismus", slug: "stoizismus", summary: "Hellenistische Schule, gegründet von Zenon von Kition: naturgemäß und vernünftig leben und unterscheiden, was von uns abhängt und was nicht.", definition: "Hellenistische Strömung, die Tugend mit einem vernunft- und naturgemäßen Leben gleichsetzt." },
    },
  },
  {
    ...base, id: "sch-epicureanism", periodId: "per-antiquity", startYear: -307, endYear: 200, influencedByIds: [], relatedSchoolIds: ["sch-stoicism"],
    translations: {
      pt: { title: "Epicurismo", slug: "epicurismo", summary: "Escola fundada por Epicuro no Jardim de Atenas: o prazer moderado e a ausência de perturbação (ataraxia) como fim da vida.", definition: "Doutrina que identifica o bem supremo com o prazer entendido como ausência de dor e de perturbação, apoiada numa física atomista." },
      en: { title: "Epicureanism", slug: "epicureanism", summary: "School founded by Epicurus in the Garden at Athens: moderate pleasure and freedom from disturbance (ataraxia) as the end of life.", definition: "Doctrine identifying the highest good with pleasure understood as absence of pain and disturbance, supported by an atomist physics." },
      fr: { title: "Épicurisme", slug: "epicurisme", summary: "École fondée par Épicure dans le Jardin d'Athènes : le plaisir modéré et l'absence de trouble (ataraxie) comme fin de la vie.", definition: "Doctrine identifiant le souverain bien au plaisir compris comme absence de douleur et de trouble." },
      de: { title: "Epikureismus", slug: "epikureismus", summary: "Von Epikur im Garten zu Athen gegründete Schule: maßvolle Lust und Unerschütterlichkeit (Ataraxie) als Lebensziel.", definition: "Lehre, die das höchste Gut mit Lust als Abwesenheit von Schmerz und Unruhe gleichsetzt." },
    },
  },
  {
    ...base, id: "sch-platonism", periodId: "per-antiquity", startYear: -387, endYear: 529, influencedByIds: [], relatedSchoolIds: ["sch-aristotelianism"],
    translations: {
      pt: { title: "Platonismo", slug: "platonismo", summary: "Tradição derivada de Platão: as Formas inteligíveis como realidade verdadeira e o mundo sensível como cópia.", definition: "Corrente que sustenta a existência de realidades inteligíveis (Formas ou Ideias) das quais o mundo sensível participa." },
      en: { title: "Platonism", slug: "platonism", summary: "Tradition derived from Plato: the intelligible Forms as true reality and the sensible world as copy.", definition: "Current holding that intelligible realities (Forms or Ideas) exist and that the sensible world participates in them." },
      fr: { title: "Platonisme", slug: "platonisme", summary: "Tradition issue de Platon : les Formes intelligibles comme réalité véritable et le monde sensible comme copie.", definition: "Courant soutenant l'existence de réalités intelligibles (Formes ou Idées) auxquelles le monde sensible participe." },
      de: { title: "Platonismus", slug: "platonismus", summary: "Von Platon ausgehende Tradition: die intelligiblen Ideen als wahre Wirklichkeit, die Sinnenwelt als Abbild.", definition: "Strömung, die intelligible Wirklichkeiten (Ideen) annimmt, an denen die Sinnenwelt teilhat." },
    },
  },
  {
    ...base, id: "sch-aristotelianism", periodId: "per-antiquity", startYear: -335, endYear: null, influencedByIds: ["sch-platonism"], relatedSchoolIds: ["sch-platonism", "sch-scholasticism"],
    translations: {
      pt: { title: "Aristotelismo", slug: "aristotelismo", summary: "Tradição fundada no pensamento de Aristóteles: substância, causas, lógica e ética das virtudes.", definition: "Conjunto de doutrinas que seguem Aristóteles na lógica, na física, na metafísica da substância e na ética das virtudes." },
      en: { title: "Aristotelianism", slug: "aristotelianism", summary: "Tradition grounded in Aristotle's thought: substance, causes, logic and virtue ethics.", definition: "Body of doctrines following Aristotle in logic, physics, the metaphysics of substance and virtue ethics." },
      fr: { title: "Aristotélisme", slug: "aristotelisme", summary: "Tradition fondée sur la pensée d'Aristote : substance, causes, logique et éthique des vertus.", definition: "Ensemble de doctrines qui suivent Aristote en logique, physique, métaphysique de la substance et éthique des vertus." },
      de: { title: "Aristotelismus", slug: "aristotelismus", summary: "Auf Aristoteles gründende Tradition: Substanz, Ursachen, Logik und Tugendethik.", definition: "Lehren, die Aristoteles in Logik, Physik, Substanzmetaphysik und Tugendethik folgen." },
    },
  },
  {
    ...base, id: "sch-scholasticism", periodId: "per-medieval", startYear: 1100, endYear: 1500, influencedByIds: ["sch-aristotelianism", "sch-platonism"], relatedSchoolIds: ["sch-aristotelianism"],
    translations: {
      pt: { title: "Escolástica", slug: "escolastica", summary: "Método universitário medieval de conciliar fé e razão por meio da disputa e do comentário.", definition: "Corrente do pensamento medieval que aplica a lógica aristotélica às questões teológicas e filosóficas, por meio de disputas e comentários." },
      en: { title: "Scholasticism", slug: "scholasticism", summary: "Medieval university method of reconciling faith and reason through disputation and commentary.", definition: "Current of medieval thought applying Aristotelian logic to theological and philosophical questions through disputation and commentary." },
      fr: { title: "Scolastique", slug: "scolastique", summary: "Méthode universitaire médiévale pour concilier foi et raison par la dispute et le commentaire.", definition: "Courant de la pensée médiévale appliquant la logique aristotélicienne aux questions théologiques et philosophiques." },
      de: { title: "Scholastik", slug: "scholastik", summary: "Mittelalterliche Universitätsmethode, Glaube und Vernunft durch Disputation und Kommentar zu verbinden.", definition: "Strömung des mittelalterlichen Denkens, die aristotelische Logik auf theologische und philosophische Fragen anwendet." },
    },
  },
  {
    ...base, id: "sch-rationalism", periodId: "per-modern", startYear: 1637, endYear: 1781, influencedByIds: ["sch-platonism", "sch-scholasticism"], relatedSchoolIds: ["sch-empiricism"],
    translations: {
      pt: { title: "Racionalismo", slug: "racionalismo", summary: "A razão como fonte principal do conhecimento: Descartes, Spinoza e Leibniz.", definition: "Posição epistemológica segundo a qual a razão, e não a experiência sensível, é a fonte primária e o critério do conhecimento verdadeiro." },
      en: { title: "Rationalism", slug: "rationalism", summary: "Reason as the main source of knowledge: Descartes, Spinoza and Leibniz.", definition: "Epistemological position holding that reason, not sense experience, is the primary source and criterion of true knowledge." },
      fr: { title: "Rationalisme", slug: "rationalisme", summary: "La raison comme source principale de la connaissance : Descartes, Spinoza et Leibniz.", definition: "Position épistémologique selon laquelle la raison, et non l'expérience sensible, est la source première de la connaissance." },
      de: { title: "Rationalismus", slug: "rationalismus", summary: "Die Vernunft als Hauptquelle der Erkenntnis: Descartes, Spinoza und Leibniz.", definition: "Erkenntnistheoretische Position, nach der die Vernunft, nicht die Sinneserfahrung, die primäre Quelle wahren Wissens ist." },
    },
  },
  {
    ...base, id: "sch-empiricism", periodId: "per-modern", startYear: 1690, endYear: 1781, influencedByIds: ["sch-aristotelianism"], relatedSchoolIds: ["sch-rationalism", "sch-positivism"],
    translations: {
      pt: { title: "Empirismo", slug: "empirismo", summary: "A experiência como origem de todo conhecimento: Locke, Berkeley e Hume.", definition: "Posição epistemológica segundo a qual todo conhecimento deriva, direta ou indiretamente, da experiência sensível." },
      en: { title: "Empiricism", slug: "empiricism", summary: "Experience as the origin of all knowledge: Locke, Berkeley and Hume.", definition: "Epistemological position holding that all knowledge derives, directly or indirectly, from sense experience." },
      fr: { title: "Empirisme", slug: "empirisme", summary: "L'expérience comme origine de toute connaissance : Locke, Berkeley et Hume.", definition: "Position épistémologique selon laquelle toute connaissance dérive de l'expérience sensible." },
      de: { title: "Empirismus", slug: "empirismus", summary: "Die Erfahrung als Ursprung allen Wissens: Locke, Berkeley und Hume.", definition: "Erkenntnistheoretische Position, nach der alles Wissen aus der Sinneserfahrung stammt." },
    },
  },
  {
    ...base, id: "sch-idealism", periodId: "per-19th", startYear: 1781, endYear: 1850, influencedByIds: ["sch-rationalism", "sch-platonism"], relatedSchoolIds: ["sch-marxism"],
    translations: {
      pt: { title: "Idealismo", slug: "idealismo", summary: "A realidade como constituída pelo espírito ou pela razão: de Kant ao idealismo alemão de Fichte, Schelling e Hegel.", definition: "Família de doutrinas segundo as quais a realidade é, em sua estrutura fundamental, dependente do espírito, da consciência ou da razão." },
      en: { title: "Idealism", slug: "idealism", summary: "Reality as constituted by spirit or reason: from Kant to the German idealism of Fichte, Schelling and Hegel.", definition: "Family of doctrines according to which reality is, in its fundamental structure, dependent on mind, consciousness or reason." },
      fr: { title: "Idéalisme", slug: "idealisme", summary: "La réalité comme constituée par l'esprit ou la raison : de Kant à l'idéalisme allemand de Fichte, Schelling et Hegel.", definition: "Famille de doctrines selon lesquelles la réalité dépend fondamentalement de l'esprit, de la conscience ou de la raison." },
      de: { title: "Idealismus", slug: "idealismus", summary: "Die Wirklichkeit als durch Geist oder Vernunft konstituiert: von Kant zum Deutschen Idealismus Fichtes, Schellings und Hegels.", definition: "Lehren, nach denen die Wirklichkeit in ihrer Grundstruktur vom Geist, Bewusstsein oder der Vernunft abhängt." },
    },
  },
  {
    ...base, id: "sch-existentialism", periodId: "per-20th", startYear: 1843, endYear: 1980, influencedByIds: ["sch-phenomenology"], relatedSchoolIds: ["sch-phenomenology"],
    translations: {
      pt: { title: "Existencialismo", slug: "existencialismo", summary: "A existência precede a essência: liberdade, angústia e responsabilidade em Kierkegaard, Heidegger, Sartre e Beauvoir.", definition: "Corrente que parte da existência concreta e singular do indivíduo, marcada por liberdade, escolha, angústia e finitude." },
      en: { title: "Existentialism", slug: "existentialism", summary: "Existence precedes essence: freedom, anxiety and responsibility in Kierkegaard, Heidegger, Sartre and Beauvoir.", definition: "Current starting from the concrete, singular existence of the individual, marked by freedom, choice, anxiety and finitude." },
      fr: { title: "Existentialisme", slug: "existentialisme", summary: "L'existence précède l'essence : liberté, angoisse et responsabilité chez Kierkegaard, Heidegger, Sartre et Beauvoir.", definition: "Courant partant de l'existence concrète et singulière de l'individu, marquée par la liberté, le choix, l'angoisse et la finitude." },
      de: { title: "Existentialismus", slug: "existentialismus", summary: "Die Existenz geht der Essenz voraus: Freiheit, Angst und Verantwortung bei Kierkegaard, Heidegger, Sartre und Beauvoir.", definition: "Strömung, die von der konkreten, einzelnen Existenz des Individuums ausgeht, geprägt von Freiheit, Wahl, Angst und Endlichkeit." },
    },
  },
  {
    ...base, id: "sch-phenomenology", periodId: "per-20th", startYear: 1900, endYear: null, influencedByIds: ["sch-rationalism", "sch-idealism"], relatedSchoolIds: ["sch-existentialism"],
    translations: {
      pt: { title: "Fenomenologia", slug: "fenomenologia", summary: "Descrever os fenômenos tal como se dão à consciência: Husserl, Heidegger, Merleau-Ponty.", definition: "Método e corrente que descreve as estruturas da experiência tal como se apresentam à consciência, suspendendo pressupostos sobre a existência do mundo." },
      en: { title: "Phenomenology", slug: "phenomenology", summary: "Describing phenomena as they are given to consciousness: Husserl, Heidegger, Merleau-Ponty.", definition: "Method and current describing the structures of experience as they present themselves to consciousness, suspending assumptions about the existence of the world." },
      fr: { title: "Phénoménologie", slug: "phenomenologie", summary: "Décrire les phénomènes tels qu'ils se donnent à la conscience : Husserl, Heidegger, Merleau-Ponty.", definition: "Méthode et courant décrivant les structures de l'expérience telles qu'elles se présentent à la conscience." },
      de: { title: "Phänomenologie", slug: "phaenomenologie", summary: "Phänomene beschreiben, wie sie dem Bewusstsein gegeben sind: Husserl, Heidegger, Merleau-Ponty.", definition: "Methode und Strömung, die die Strukturen der Erfahrung so beschreibt, wie sie sich dem Bewusstsein zeigen." },
    },
  },
  {
    ...base, id: "sch-pragmatism", periodId: "per-19th", startYear: 1870, endYear: null, influencedByIds: ["sch-empiricism"], relatedSchoolIds: ["sch-empiricism", "sch-positivism"],
    translations: {
      pt: { title: "Pragmatismo", slug: "pragmatismo", summary: "O significado e a verdade das ideias avaliados por suas consequências práticas: Peirce, James e Dewey.", definition: "Corrente norte-americana segundo a qual o sentido de um conceito e o valor de uma crença se medem por seus efeitos práticos." },
      en: { title: "Pragmatism", slug: "pragmatism", summary: "The meaning and truth of ideas assessed by their practical consequences: Peirce, James and Dewey.", definition: "American current according to which the meaning of a concept and the value of a belief are measured by their practical effects." },
      fr: { title: "Pragmatisme", slug: "pragmatisme", summary: "Le sens et la vérité des idées évalués par leurs conséquences pratiques : Peirce, James et Dewey.", definition: "Courant américain selon lequel le sens d'un concept et la valeur d'une croyance se mesurent à leurs effets pratiques." },
      de: { title: "Pragmatismus", slug: "pragmatismus", summary: "Bedeutung und Wahrheit von Ideen an ihren praktischen Folgen gemessen: Peirce, James und Dewey.", definition: "Amerikanische Strömung, nach der sich Sinn eines Begriffs und Wert einer Überzeugung an ihren praktischen Wirkungen bemessen." },
    },
  },
  {
    ...base, id: "sch-positivism", periodId: "per-19th", startYear: 1830, endYear: 1960, influencedByIds: ["sch-empiricism"], relatedSchoolIds: ["sch-empiricism", "sch-pragmatism"],
    translations: {
      pt: { title: "Positivismo", slug: "positivismo", summary: "Só o conhecimento científico, fundado em fatos observáveis, é legítimo: Comte e, depois, o Círculo de Viena.", definition: "Corrente que restringe o conhecimento válido ao que pode ser verificado pela observação e pelo método científico." },
      en: { title: "Positivism", slug: "positivism", summary: "Only scientific knowledge grounded in observable facts is legitimate: Comte and, later, the Vienna Circle.", definition: "Current restricting valid knowledge to what can be verified by observation and scientific method." },
      fr: { title: "Positivisme", slug: "positivisme", summary: "Seul le savoir scientifique fondé sur des faits observables est légitime : Comte puis le Cercle de Vienne.", definition: "Courant restreignant le savoir valide à ce qui peut être vérifié par l'observation et la méthode scientifique." },
      de: { title: "Positivismus", slug: "positivismus", summary: "Nur wissenschaftliches, auf beobachtbaren Tatsachen gründendes Wissen ist legitim: Comte und später der Wiener Kreis.", definition: "Strömung, die gültiges Wissen auf das durch Beobachtung und wissenschaftliche Methode Überprüfbare beschränkt." },
    },
  },
  {
    ...base, id: "sch-marxism", periodId: "per-19th", startYear: 1845, endYear: null, influencedByIds: ["sch-idealism"], relatedSchoolIds: ["sch-idealism"],
    translations: {
      pt: { title: "Marxismo", slug: "marxismo", summary: "Materialismo histórico e crítica da economia política: a história como luta de classes.", definition: "Corrente fundada por Marx e Engels que explica a história pelas relações materiais de produção e pela luta de classes, e critica o capitalismo." },
      en: { title: "Marxism", slug: "marxism", summary: "Historical materialism and the critique of political economy: history as class struggle.", definition: "Current founded by Marx and Engels explaining history through material relations of production and class struggle, and critiquing capitalism." },
      fr: { title: "Marxisme", slug: "marxisme", summary: "Matérialisme historique et critique de l'économie politique : l'histoire comme lutte des classes.", definition: "Courant fondé par Marx et Engels expliquant l'histoire par les rapports matériels de production et la lutte des classes." },
      de: { title: "Marxismus", slug: "marxismus", summary: "Historischer Materialismus und Kritik der politischen Ökonomie: Geschichte als Klassenkampf.", definition: "Von Marx und Engels begründete Strömung, die Geschichte aus materiellen Produktionsverhältnissen und Klassenkampf erklärt." },
    },
  },
];
