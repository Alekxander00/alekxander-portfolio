import React, { useState } from 'react';
import CRTFilter from '../components/CRTFilter';
import GlitchText from '../components/GlitchText';
import '../styles/references.css';

const References = () => {
    const [activeCategory, setActiveCategory] = useState('all');

    const references = [
        {
            id: 1,
            name: 'Jenova Chen',
            url: 'https://jenovachen.info/',
            category: 'videojuegos',
            description: 'Creador de videojuegos y fundador de thatgamecompany, conocido por títulos como Journey, Flower y flOw. Busca crear experiencias emocionales profundas que conecten a las personas de manera significativa.',
            detail: 'Chen es un pionero en el diseño de juegos que priorizan la experiencia emocional sobre la mecánica tradicional. En Journey, eliminó elementos competitivos y de comunicación explícita para fomentar una conexión orgánica entre jugadores. Cree que los juegos deben ofrecer "estimulación intelectual" relevante para la vida real y ser lo suficientemente profundos como para conmover a los adultos. Su filosofía de diseño minimalista busca transmitir mensajes claros y poderosos, comparando el proceso con diseñar un "jardín japonés" donde nada puede ser removido.',
            notableWorks: ['Journey', 'Flower', 'flOw'],
            color: '#00ff88'
        },
        {
            id: 2,
            name: 'Playdead Studio',
            url: 'https://playdead.com/',
            category: 'videojuegos',
            description: 'Estudio independiente danés fundado en 2006, creador de Limbo e Inside. Destaca por su narrativa ambiental, atmósfera inquietante y un pulido excepcional.',
            detail: 'Playdead se fundó en Copenhague con la misión de desarrollar "experiencias de autor novedosas y altamente pulidas". Con un equipo pequeño (menos de 50 empleados), el estudio valora la independencia creativa por encima de todo. Su primer título, Limbo (2010), sorprendió con su estética en blanco y negro y narrativa ambiental, ganando más de 100 premios internacionales. Inside (2016) fue aún más aclamado, destacando por su diseño de audio innovador (que utilizó conducción ósea en un cráneo humano) y narrativa críptica. Actualmente trabajan en un juego de ciencia ficción en 3D.',
            notableWorks: ['Limbo', 'Inside'],
            color: '#ff00ff'
        },
        {
            id: 3,
            name: 'CampoSanto',
            url: 'https://www.camposanto.com/',
            category: 'videojuegos',
            description: 'Desarrollador estadounidense conocido por Firewatch, un "walking simulator" que combina narrativa profunda con un estilo visual inspirado en ilustraciones del New Deal.',
            detail: 'Fundado en 2013 por ex-empleados de Telltale Games (incluyendo a los escritores de The Walking Dead), Campo Santo se centra en narrativas inmersivas. Firewatch (2016) comenzó como una pintura del artista Olly Moss, que luego se adaptó a un entorno 3D con inspiración en la iconografía del Servicio de Parques Nacionales. El estudio fue adquirido por Valve en 2018, aunque mantiene su dirección creativa. Su enfoque en personajes complejos y diálogos realistas ha influenciado una generación de juegos narrativos.',
            notableWorks: ['Firewatch', 'In the Valley of Gods (en pausa)'],
            color: '#0088ff'
        },
        {
            id: 4,
            name: 'Max Cooper',
            url: 'https://maxcooper.net/',
            category: 'audiovisual',
            description: 'Músico electrónico y artista visual que fusiona composición musical con visuales generativos y datos científicos para crear experiencias sensoriales inmersivas.',
            detail: 'Con formación científica (PhD en bioinformática), Cooper utiliza datos y algoritmos para generar visuales que representan conceptos matemáticos, biológicos y físicos. Sus actuaciones en vivo son experiencias audiovisuales completas donde música y visuales se entrelazan para comunicar ideas complejas sobre la naturaleza, la ciencia y la humanidad. Su trabajo demuestra cómo la tecnología puede hacer tangible lo abstracto.',
            notableWorks: ['Emergence', 'Yearning for the Infinite', 'Unspoken Words'],
            color: '#00ffff'
        },
        {
            id: 5,
            name: 'Gmunk',
            url: 'https://gmunk.com/',
            category: 'audiovisual',
            description: 'Artista visual y director creativo especializado en motion graphics, dirección de arte para cine y experiencias inmersivas a gran escala.',
            detail: 'Bradley G. Munkowitz (Gmunk) es conocido por su trabajo en películas como Tron: Legacy y Oblivion, donde creó interfaces futuristas y gráficos holográficos. Su estilo combina estética retro-futurista con tecnología moderna, creando mundos visuales cohesivos que sienten tanto familiares como alienígenas. Explora constantemente nuevas tecnologías como proyección mapping, realidad aumentada y renderizado en tiempo real.',
            notableWorks: ['TRON: Legacy interfaces', 'Nike: The N.354', 'Google I/O keynote visuals'],
            color: '#ff5500'
        },
        {
            id: 6,
            name: 'Ash Thorp',
            url: 'https://www.behance.net/ashthorp',
            category: 'diseño',
            description: 'Diseñador gráfico, ilustrador y director creativo que trabaja en intersección entre el diseño, el cine y la cultura futurista.',
            detail: 'Thorp ha contribuido a proyectos cinematográficos de alto perfil como Ghost in the Shell, Ender\'s Game y X-Men: Days of Future Past. Su estilo se caracteriza por un minimalismo detallado, paletas de color atmosféricas y una sensación de escala épica. Más allá del trabajo comercial, sus proyectos personales exploran temas de transhumanismo, inteligencia artificial y futuros especulativos, a menudo presentados como "biblia de producción" conceptualmente ricas.',
            notableWorks: ['Ghost in the Shell (2017)', 'Pupil: A Visual Album', 'ACID: A Cyberpunk Fashion Film'],
            color: '#aa00ff'
        },
        {
            id: 7,
            name: 'Beeple (Mike Winkelmann)',
            url: 'https://www.behance.net/beeple',
            category: 'arte digital',
            description: 'Artista digital conocido por su proyecto "Everydays", donde ha creado y publicado una obra de arte cada día desde mayo de 2007.',
            detail: 'Beeple se ha convertido en una figura central en la convergencia del arte digital, los NFTs y la cultura de internet. Su proyecto "Everydays", que comenzó el 1 de mayo de 2007, comprende más de 6,000 obras y es "un hito en la historia del arte digital". Su estilo mezcla sátira política distópica, humor absurdo y una estética de "exceso digital". El nombre "Beeple" proviene de un juguete de los años 80 con forma de yeti. Su venta de NFT "Everydays: The First 5000 Days" por $69 millones en 2021 marcó un punto de inflexioń cultural.',
            notableWorks: ['Everydays series', 'Crossroad', 'HUMAN ONE'],
            color: '#ffff00'
        },
        {
            id: 8,
            name: 'Refik Anadol',
            url: 'https://refikanadol.com/',
            category: 'arte digital',
            description: 'Artista de medios y pionero en la estética de datos, utiliza inteligencia artificial generativa y aprendizaje automático para crear instalaciones inmersivas.',
            detail: 'Anadol describe su trabajo como "pintar con datos", transformando conjuntos de datos en "pigmentos digitales" para hacer visible lo invisible. Entrena algoritmos de IA con datos de dominio público para visualizar la naturaleza, la vida urbana y la cultura. Su exposición "Unsupervised" en el MoMA presentaba una "IA infinita y en constante ensueño" que generaba arte en tiempo real basado en los datos del museo. Ve su trabajo como una colaboración entre humanos y máquinas, donde la IA amplía la imaginación humana sin reemplazarla.',
            notableWorks: ['Machine Hallucinations', 'Unsupervised (MoMA)', 'WDCH Dreams'],
            color: '#00aaff'
        },
        {
            id: 9,
            name: 'Marshmallow Laser Feast',
            url: 'https://marshmallowlaserfeast.com/',
            category: 'experiencias',
            description: 'Colectivo artístico que crea experiencias inmersivas que revelan las fuerzas ocultas de la naturaleza mediante tecnología de vanguardia.',
            detail: 'Su exposición "Works of Nature" invita a los espectadores a explorar "una sola respiración" a través de un viaje sensorial desde las raíces de un árbol amazónico hasta el nacimiento de las galaxias. Utilizan escáneres LIDAR, realidad virtual y proyecciones a gran escala para hacer tangible lo invisible, como mostrar que los árboles tienen "una especie de latido" que pulsa con la salida y puesta del sol. Su trabajo explora la interconexión fundamental de toda la vida a través del proceso de respiración.',
            notableWorks: ['Works of Nature', 'We Live in an Ocean of Air', 'Evolver VR'],
            color: '#ff0066'
        },
        {
            id: 10,
            name: 'Joel G',
            url: 'https://joelgc.com/',
            category: 'arte digital',
            description: 'Artista y animador independiente conocido por crear la serie web surrealista ENA, que combina estética low-poly, humor absurdo y narrativas psicodélicas con una paleta de colores vibrante.',
            detail: 'Joel G (Joel Guerra) es un artista digital mexicano-estadounidense que ganó reconocimiento internacional con su serie animada ENA, publicada inicialmente en YouTube. Su estilo característico mezcla modelos 3D low-poly con animación 2D, creando un lenguaje visual único que oscila entre lo nostálgico y lo vanguardista. ENA explora temas de identidad, realidad y absurdismo existencial a través de diálogos enigmáticos y transiciones visuales sorprendentes. Joel G maneja prácticamente todos los aspectos de la producción de manera independiente: modelado 3D, animación, guion, voz y música, demostrando un dominio completo de la cadena de producción digital.',
            notableWorks: ['ENA (serie web)', 'Temptation Stairway', 'Extinction Party', 'Dubious Disc'],
            color: '#ffaa00'
        }
    ];

    const categories = [
        { id: 'all', name: 'Todos' },
        { id: 'videojuegos', name: 'Videojuegos' },
        { id: 'arte digital', name: 'Arte Digital' },
        { id: 'audiovisual', name: 'Audiovisual' },
        { id: 'diseño', name: 'Diseño' },
        { id: 'experiencias', name: 'Experiencias' }
    ];

    const filteredReferences = activeCategory === 'all'
        ? references
        : references.filter(ref => ref.category === activeCategory);

    return (
        <div className="references-page">
            <CRTFilter intensity="medium">
                <div className="references-container">
                    <div className="references-header">
                        <h1 className="references-title">
                            <span className="title-text">REFERENTES</span>
                            <span className="title-glitch"></span>
                        </h1>
                        <div className="title-subtitle">
                            Las mentes que dan forma a mi visión creativa
                        </div>
                    </div>

                    <div className="categories-filter">
                        <div className="categories-list">
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                                    onClick={() => setActiveCategory(category.id)}
                                    style={{
                                        '--neon-color': references.find(r => r.category === category.id)?.color || '#00ffff'
                                    }}
                                >
                                    <span className="btn-text">{category.name}</span>
                                    <span className="btn-glow"></span>
                                </button>
                            ))}
                        </div>
                        <div className="filter-status">
                            Mostrando {filteredReferences.length} de {references.length} referentes
                        </div>
                    </div>

                    <div className="references-grid">
                        {filteredReferences.map(ref => (
                            <div
                                key={ref.id}
                                className="reference-card"
                                style={{ '--accent-color': ref.color }}
                            >
                                <div className="card-header">
                                    <div className="card-category">
                                        <span className="category-dot" style={{ backgroundColor: ref.color }}></span>
                                        {ref.category}
                                    </div>
                                    <div className="card-number">0{ref.id}</div>
                                </div>

                                <div className="card-content">
                                    <h3 className="card-title">
                                        <a
                                            href={ref.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="title-link"
                                        >
                                            {ref.name}
                                            <span className="link-icon">↗</span>
                                        </a>
                                    </h3>

                                    <p className="card-description">{ref.description}</p>

                                    <div className="card-detail">
                                        <p>{ref.detail}</p>
                                    </div>

                                    <div className="card-works">
                                        <h4 className="works-title">Obras notables:</h4>
                                        <div className="works-list">
                                            {ref.notableWorks.map((work, index) => (
                                                <span key={index} className="work-tag">
                                                    {work}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="card-footer">
                                    <a
                                        href={ref.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="explore-link"
                                    >
                                        <span className="link-text">Explorar referente</span>
                                        <div className="link-line"></div>
                                    </a>
                                </div>

                                <div className="card-glitch"></div>
                            </div>
                        ))}
                    </div>

                    <div className="references-conclusion">
                        <div className="conclusion-content">
                            <h3 className="conclusion-title">¿Por qué estos referentes?</h3>
                            <p className="conclusion-text">
                                Esta selección representa la intersección entre narrativa, tecnología y experiencia sensorial.
                                Cada uno demuestra cómo los medios digitales pueden trascender su función utilitaria para
                                convertirse en vehículos de expresión emocional, conexión humana y exploración filosófica.
                            </p>
                            <p className="conclusion-text">
                                Colectivamente, inspiran mi búsqueda de crear trabajos que no solo funcionen técnicamente,
                                sino que resuenen a nivel humano, donde cada línea de código, cada píxel y cada interacción
                                sirvan a una visión artística coherente.
                            </p>
                        </div>
                    </div>
                </div>
            </CRTFilter>
        </div>
    );
};

export default References;