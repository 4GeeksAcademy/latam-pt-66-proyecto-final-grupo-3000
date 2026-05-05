import { Link } from "react-router-dom";
import marlonImg from "../assets/img/Marlon_Hodgson_Software_Marketing_Engineer.webp";

const joseImg = "https://placehold.co/400x320?text=José+Mujica";

const equipo = [
    {
        nombre: "Marlon Hodgson",
        foto: marlonImg,
        descripcion: "Especialista en marketing digital y Full Stack Developer con un perfil híbrido que le permite diseñar estrategias de crecimiento y construir las herramientas tecnológicas que las hacen realidad. Su experiencia abarca conceptualización de estrategias de contenido, gestión de campañas, análisis de datos y desarrollo web completo.",
        skills: [
            "Estrategias de marketing digital y growth marketing",
            "Desarrollo web Full Stack (frontend y backend)",
            "Automatización de procesos de marketing",
            "Análisis de datos y métricas de rendimiento",
            "Integración de herramientas y APIs",
        ]
    },
    {
        nombre: "José Alfredo Mujica",
        foto: joseImg,
        descripcion: "Especialista en infraestructura de telecomunicaciones con amplia experiencia en la configuración de equipos Mikrotik (Certificado MTCNA, MTCRE, MTCWE, MTCTCE), Cisco, Ubiquiti y Mimosa. Con sólidos conocimientos en despliegue y gestión de redes FTTH, actualmente expande su perfil como Full Stack Developer con el objetivo de fusionar el desarrollo de software con el mundo de las redes y automatizar procesos de infraestructura.",
        skills: []
    },
];

export const QuienesSomos = () => {
    return (
        <div className="container mt-5 pt-5 mb-5">
            <h1 className="display-5 fw-bold mb-4">¿Quiénes somos?</h1>

            <p className="lead mb-3">
                Habit Tracker es un equipo multidisciplinario enfocado en desarrollo full stack y soluciones digitales integrales. Combinamos expertise en marketing digital, infraestructura de redes, desarrollo de software y estrategia tecnológica para crear proyectos que van más allá del código.
            </p>
            <p className="mb-3">
                Nuestra fortaleza radica en la diversidad de perfiles: no solo construimos aplicaciones, también entendemos cómo conectarlas, promocionarlas y escalarlas. Esta visión 360° nos permite abordar cada proyecto desde múltiples ángulos, asegurando soluciones técnicamente sólidas, estratégicamente pensadas y listas para crecer.
            </p>
            <p className="mb-5">
                Creemos en la tecnología con propósito: cada línea de código, cada estrategia digital y cada infraestructura que diseñamos tiene un objetivo claro: optimizar procesos, mejorar experiencias y generar resultados medibles.
            </p>

            <div className="row g-4">
                {equipo.map((miembro, index) => (
                    <div key={index} className="col-12 col-md-6">
                        <div className="card h-100 shadow-sm border-0">
                            <img
                                src={miembro.foto}
                                alt={miembro.nombre}
                                className="card-img-top"
                                style={{ objectFit: "contain", width: "100%", aspectRatio: "1/1" }}
                            />
                            <div className="card-body">
                                <h5 className="card-title fw-bold">{miembro.nombre}</h5>
                                <p className="card-text text-muted">{miembro.descripcion}</p>
                                {miembro.skills.length > 0 && (
                                    <ul className="mt-2 ps-3">
                                        {miembro.skills.map((skill, i) => (
                                            <li key={i} className="small">{skill}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-5 text-center">
                <Link to="/" className="btn btn-outline-primary">
                    <i className="fa-solid fa-house me-2"></i> Volver al Inicio
                </Link>
            </div>
        </div>
    );
};
