import React, { useState, useEffect } from 'react';
import API from "./utils/api";
const STRAPI_URL = "https://boco-agency-recreation-backend-4.onrender.com";

// Define the types for the data coming from Strapi
interface ServiceCard {
    service_title: string;
    service_description: string[];
    service_image: {
        url: string; // Corrected: Image URL is directly on the service_image object
    };
}

interface HomepageData {
    hero_title: string;
    hero_subtitle: string;
    hero_description: string;
    hero_bullets: string[];
    hero_image: {
        url: string;
    };
    brands_count: number;
    brands_title: string;
    brands_description: string;
    service: string;
    services_list: ServiceCard[];
    footer_copyright_text: string;
}

interface BrandLogo {
    url: string;
}

interface BrandsData {
    logo: BrandLogo[];
}

interface ProjectImage {
    id: number;
    url: string;
    // ...other fields if needed
}

interface ProjectsData {
    project_title: string;
    project_description: string;
    project_images: ProjectImage[];
}

interface Stat {
    id: number;
    label: string;
    value: string;
}

interface CaseStudy {
    id: number;
    title: string;
    category: string;
    description: string;
    main_image: { url: string };
    stats: Stat[];
    case_study_link: string;
}

const App: React.FC = () => {
    const [homepageData, setHomepageData] = useState<HomepageData | null>(null);
    const [brandsData, setBrandsData] = useState<BrandsData | null>(null);
    const [projectsData, setProjectsData] = useState<ProjectsData[] | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await API.get(`/homepage?populate[hero_image]=true&populate[services_list][populate]=service_image`);
                if (response.data.data) {
                    // Correctly access the single-type data from the root of the 'data' object
                    setHomepageData(response.data.data as HomepageData);
                    // console.log('Fetched homepage data:', response.data.data);

                    // Fetch brands data
                    const brandsResponse = await API.get(`/brands?populate=*`);
                    if (brandsResponse.data.data && brandsResponse.data.data.length > 0) {

                        setBrandsData({ logo: brandsResponse.data.data[0].logo });
                        console.log('Fetched brands data:', brandsResponse.data.data[0].logo);
                    } else {
                        setBrandsData(null);
                    }
                    const projectsResponse = await API.get(`/projects?populate=*`);
                    if (projectsResponse.data.data && projectsResponse.data.data.length > 0) {
                        setProjectsData(projectsResponse.data.data as ProjectsData[]);
                    } else {
                        setProjectsData(null);
                    }
                } else {
                    // If no data is found, set to null
                    setHomepageData(null);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setHomepageData(null);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (projectsData && projectsData.length > 0) {
            setCurrentSlide(0);
        }
    }, [projectsData]);

    const goToPrevSlide = () => {
        if (!projectsData) return;
        setCurrentSlide((prev) => (prev === 0 ? projectsData.length - 1 : prev - 1));
    };

    const goToNextSlide = () => {
        if (!projectsData) return;
        setCurrentSlide((prev) => (prev === projectsData.length - 1 ? 0 : prev + 1));
    };

    useEffect(() => {
        API.get('/case-studies?populate=*').then(res => {
            setCaseStudies(res.data.data.map((item: any) => ({
                id: item.id,
                title: item.title,
                category: item.category,
                description: item.description,
                main_image: item.main_image || {},
                stats: item.stat ? item.stat.map((stat: any) => ({
                    id: stat.id,
                    label: stat.label,
                    value: stat.value,
                })) : [],
                case_study_link: item.case_study_link,
            })));
        });
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                <div className="text-xl font-medium">Loading...</div>
            </div>
        );
    }

    if (!homepageData) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-6">
                <div className="text-center bg-gray-800 p-8 rounded-lg shadow-xl">
                    <h1 className="text-3xl font-bold mb-4">No Homepage Data Found</h1>
                    <p className="text-gray-400">
                        Please make sure you have created and published an entry for 'Homepage'
                        in the Strapi Content Manager.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white-900 px-14 min-h-screen font-inter text-gray-300">
            {/* Header with Nav and CTA */}
            <header className="p-4 md:p-6 lg:p-6 flex justify-between items-center top-0 z-50">
                <div className=" lg:text-4xl text-2xl md:text-2xl pl-4 font-bold text-blue-950">boco</div>
                <nav className="hidden md:flex rounded-full border-purple-200 border justify-center p-4 space-x-4 md:space-x-10">
                    <a href="#hero" className="text-lg font-medium text-blue-950 transition-colors duration-200">Home</a>
                    <a href="#services" className="text-lg font-medium text-blue-950 transition-colors duration-200">Services</a>
                    <a href="#about" className="text-lg font-medium text-blue-950 transition-colors duration-200">About</a>
                    <a href="#contact" className="text-lg font-medium text-blue-950 transition-colors duration-200">Contact</a>
                </nav>
                <button className="flex items-center space-x-2 bg-blue-950 text-white font-medium py-1 px-8 rounded-full border-blue-950 border">
                    Talk to Us
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none" className="pl-2">
                        <circle cx="24" cy="24" r="24" fill="white"></circle>
                        <mask id="mask0_302_17084" maskUnits="userSpaceOnUse" x="12" y="12" width="24" height="24">
                            <rect x="12" y="12" width="36" height="36" fill="#FFFF61"></rect>
                        </mask>
                        <g mask="url(#mask0_302_17084)">
                            <path d="M18.2942 29.6442L17.25 28.6L27.0904 18.75H18.1442V17.25H29.6442V28.75H28.1442V19.8038L18.2942 29.6442Z" fill="#060237"></path>
                        </g>
                    </svg>
                </button>
            </header>

            {/* Hero Section */}
            <section id="hero" className="flex flex-col-reverse md:flex-row p-4 md:p-12 lg:p-24 relative overflow-hidden">
                <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left z-10 p-4 md:p-0">
                    <h1 className="text-4xl md:text-6xl lg:text-5xl font-bold text-blue-950 mb-4">
                        {homepageData.hero_title}
                    </h1>
                    <p className="lg:text-xl font-medium md:text-xl sm:text-lg text-blue-950 mb-8">
                        {homepageData.hero_description}
                    </p>
                    <ul className="list-none lg:text-xl text-blue-950 font-bold mb-8 space-y-2">
                        {(homepageData.hero_bullets).map((bullet, index) => (
                            <li key={index} className="flex items-center space-x-2">
                                <img src="https://cdn.prod.website-files.com/653b9d5d88756f8574352cb0/6707981d6373cf86d09d4db5_Vector.svg" loading="lazy" alt="" />
                                <span className='pl-2'>{bullet}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
                        <button className="text-blue-950 font-bold py-3 px-8 rounded-full border-blue-950 border">
                            Audit My Website
                        </button>
                        <button className="flex items-center space-x-2 bg-blue-950 text-white font-medium py-1 px-8 rounded-full border-blue-950 border">
                            Talk to Us
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none" className="pl-2">
                                <circle cx="24" cy="24" r="24" fill="white"></circle>
                                <mask id="mask0_302_17084" maskUnits="userSpaceOnUse" x="12" y="12" width="24" height="24">
                                    <rect x="12" y="12" width="36" height="36" fill="#FFFF61"></rect>
                                </mask>
                                <g mask="url(#mask0_302_17084)">
                                    <path d="M18.2942 29.6442L17.25 28.6L27.0904 18.75H18.1442V17.25H29.6442V28.75H28.1442V19.8038L18.2942 29.6442Z" fill="#060237"></path>
                                </g>
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="md:w-1/2 flex justify-center md:justify-end z-10 p-4 md:p-0">
                    {homepageData.hero_image?.url ? (
                        <img
                            src={`${STRAPI_URL}${homepageData.hero_image.url}`}
                            alt="Hero"
                            className="w-full max-w-md lg:max-w-4xl rounded-2xl "
                        />
                    ) : (
                        <div className="w-full max-w-md lg:max-w-xl h-64 bg-gray-200 rounded-2xl flex items-center justify-center text-gray-500">
                            No Image
                        </div>
                    )}
                </div>
            </section>


            <div className="flex items-center my-2">
                <hr className="flex-grow border-gray-300" />
                <span className="mx-4 text-lg font-semibold text-blue-950 whitespace-nowrap">
                    Trusted by Leading Brands
                </span>
                <hr className="flex-grow border-gray-300" />
            </div>
            <section className="py-8 bg-white-950 overflow-hidden">
                <div className="marquee-container w-full overflow-hidden">
                    <div className="marquee flex space-x-12 px-6">
                        {/* First set of logos */}
                        {brandsData?.logo?.map((logo, index) => (
                            <img
                                key={`brand-logo-${index}`}
                                src={`${STRAPI_URL}${logo.url}`}
                                alt={`Brand Logo ${index}`}
                                className="h-16 w-auto transition-opacity duration-300"
                            />
                        ))}
                        {/* Duplicate set of logos for seamless loop */}
                        {brandsData?.logo?.map((logo, index) => (
                            <img
                                key={`brand-logo-duplicate-${index}`}
                                src={`${STRAPI_URL}${logo.url}`}
                                alt={`Brand Logo Duplicate ${index}`}
                                className="h-16 w-auto transition-opacity duration-300"
                            />
                        ))}
                    </div>
                </div>
            </section>

            <hr />



            {/* Mobile Screenshot Carousel with Arrow Controls */}
            <section className="py-16 flex flex-col items-center">
                {projectsData && projectsData.length > 0 && (
                    <div className="w-full max-w-5xl flex flex-col items-center py-6">
                        {/* Project Title & Description at the top */}
                        <div className="text-center mb-8">
                            <h3 className="text-4xl md:text-6xl lg:text-5xl font-bold text-blue-950 mb-4">
                                {projectsData[currentSlide].project_title}
                            </h3>
                            <p className="lg:text-xl font-medium md:text-xl sm:text-lg text-blue-950 mb-8">
                                {projectsData[currentSlide].project_description}
                            </p>
                        </div>
                        {/* Carousel with Arrow Controls below */}
                        <div className="flex items-center justify-center w-full">
                            {/* Left Arrow */}
                            <button
                                onClick={goToPrevSlide}
                                className="flex items-center justify-center w-12 h-12 bg-blue-950 text-white rounded-full shadow-lg  mr-4"
                                aria-label="Previous Project"
                            >
                                {/* Left Arrow SVG */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            {/* Carousel Images */}
                            <div className="flex space-x-4 overflow-x-auto py-8">
                                {projectsData[currentSlide].project_images.map((img, idx) => (
                                    <div
                                        key={img.id}
                                        className=" rounded-3xl  border-4  flex-shrink-0"
                                        style={{ width: '220px', height: '440px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <img
                                            src={`${STRAPI_URL}${img.url}`}
                                            alt={`Screenshot ${idx + 1}`}
                                            className="rounded-2xl object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                            {/* Right Arrow */}
                            <button
                                onClick={goToNextSlide}
                                className="flex items-center justify-center w-12 h-12 bg-blue-950 text-white rounded-full shadow-lg ml-4"
                                aria-label="Next Project"
                            >
                                {/* Right Arrow SVG */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </section>



            {/* Services Section */}
            <section id="services" className="py-16 md:py-24 lg:py-32 px-4 md:px-12 lg:px-24">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-blue-950 mb-4">{homepageData.service}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {homepageData?.services_list?.length > 0 &&
                        homepageData.services_list.map((service, index) => (
                            <div key={index} className="p-12 rounded-2xl border-purple-300 border duration-300 bg-purple-50 flex flex-col items-center">
                                {/* Service Image */}
                                {service.service_image?.url && (
                                    <img
                                        src={`${STRAPI_URL}${service.service_image.url}`}
                                        alt={service.service_title}
                                        className="w-20 h-20 object-cover rounded-full mb-4 border-2 border-purple-200"
                                    />
                                )}
                                <h3 className="text-2xl font-semibold text-blue-950 mb-2 text-center">{service.service_title}</h3>
                                <ul className="text-blue-950 text-left list-disc list-inside space-y-1 mt-4">
                                    {service.service_description?.map((desc, i) => (
                                        <li key={i} className="flex items-center space-x-2">
                                            <img src="https://cdn.prod.website-files.com/653b9d5d88756f8574352cb0/6707981d6373cf86d09d4db5_Vector.svg" loading="lazy" alt="" />
                                            <span className='pl-2'>{desc}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                </div>
            </section>

            <div className="text-center mb-8">
                <h2 className="text-4xl md:text-5xl font-bold text-blue-950">Check out my use cases</h2>
            </div>


            <section className="flex flex-col md:flex-row gap-12 justify-center items-stretch py-12">
                {caseStudies
                    .filter(cs => cs && cs.title && cs.main_image && cs.main_image.url)
                    .map(cs => (
                        <div
                            key={cs.id}
                            className="bg-purple-50 rounded-2xl border-purple-300 border p-2 flex-1 max-w-xl min-h-[540px] flex flex-col"
                        >
                            <div className="flex justify-center -mt-8 mb-4">
                                <span className="bg-purple-200 text-black font-bold px-6 py-2 rounded-full text-lg">{cs.category}</span>
                            </div>
                            <img
                                src={`${STRAPI_URL}${cs.main_image.url}`}
                                alt={cs.title}
                                className="rounded-xl mb-4 w-full h-64 object-cover"
                            />
                            <div className="mb-4">
                                <span className="font-bold text-xl text-blue-950">{cs.title}</span>
                                <span className="text-blue-950 block">{cs.description}</span>
                            </div>
                            <div className="flex justify-between text-center border-t border-b border-purple-200 py-4 mb-4">
                                {cs.stats.map(stat => (
                                    <div key={stat.id} className="flex-1">
                                        <div className="font-bold text-blue-950 text-lg">{stat.value}</div>
                                        <div className="text-gray-500 text-xs">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                            <a
                                href={cs.case_study_link}
                                className="mt-auto text-blue-950 font-semibold underline text-center block"
                            >
                                Read Full Case Study &rarr;
                            </a>
                        </div>
                    ))}
            </section>

            {/* Brand Counter Section */}
            <section id="about" className="py-16 md:py-24 lg:py-30 px-4 md:px-12 lg:px-24 text-center bg-purple-50 border-purple-300 border">
                <h2 className="text-6xl md:text-7xl font-extrabold text-blue-950 mb-4">{homepageData.brands_count}+</h2>
                <p className="text-2xl font-bold text-blue-950 mb-2">{homepageData.brands_title}</p>
                <p className="text-lg text-blue-950 max-w-3xl mx-auto">{homepageData.brands_description}</p>
            </section>

            <div className="text-center mt-20">
                <h2 className="text-4xl md:text-5xl font-bold text-blue-950">
                    Faster Websites. Higher Conversion. More Revenue.
                </h2>
                <p className="mt-4 text-lg md:text-xl text-blue-950 font-medium">
                    Check out how our solutions have transformed businesses across different industries.
                </p>
            </div>

            <hr className="flex-grow mt-20" />

            {/* Footer */}
            <footer id="contact" className="py-8 text-center text-gray-500 text-sm">
                <p>{homepageData.footer_copyright_text}</p>
            </footer>
        </div>
    );
};

export default App;
