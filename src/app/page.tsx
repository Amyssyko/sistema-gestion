"use client"
import { Card, Typography } from "@material-tailwind/react"
import { LayoutHome } from "@/components/Layout/LayoutHome"
import Image from "next/image"

const Home = () => {
	return (
		<LayoutHome>
			<div className="mx-auto max-w-screen-lg py-12">
				<Card className="mb-12 overflow-hidden">
					<Image
						fetchPriority="auto"
						alt="nature"
						className="h-[24rem] w-full object-cover object-center"
						height={800}
						width={800}
						src="https://cdn.pixabay.com/photo/2016/06/15/07/27/ecuador-1458346_1280.jpg"
					/>
				</Card>
				<Typography variant="h2" color="blue-gray" className="mb-2 text-center">
					Cooperativa de Transporte Turismo La Maná
				</Typography>
				<Typography color="gray" className="font-normal text-justify">
					Somos una empresa líder en la industria del turismo, dedicada a brindar experiencias inolvidables en
					las hermosas provincias de todo el Ecuador. Desde majestuosas montañas hasta exuberantes selvas
					tropicales, pasando por encantadoras playas y fascinantes ciudades coloniales, nuestro objetivo es
					mostrarles lo mejor que este diverso país tiene para ofrecer. Con años de experiencia en el sector y
					un equipo de profesionales apasionados por el turismo, nos enorgullece ser su compañero de confianza
					en cada aventura que deseen emprender. Nuestro compromiso es proporcionarles un servicio
					excepcional, combinando comodidad, seguridad y autenticidad en cada paso del camino.
				</Typography>
				<Card className="my-8 overflow-hidden">
					<Image
						fetchPriority="auto"
						alt="nature"
						className="h-[24rem] w-full object-cover object-center"
						height={800}
						width={800}
						src="https://cdn.pixabay.com/photo/2012/02/28/10/23/tortoise-18209_1280.jpg"
					/>
				</Card>
				<Typography color="gray" className="font-normal text-justify">
					En Cooperativa de Transporte Turismo La Maná, entendemos que cada viajero es único, por lo que
					ofrecemos una amplia variedad de paquetes turísticos personalizados que se adaptan a sus intereses y
					preferencias. Desde recorridos culturales y arqueológicos hasta emocionantes actividades al aire
					libre, diseñaremos un itinerario a medida para asegurarnos de que vivan una experiencia
					verdaderamente memorable. Trabajamos en estrecha colaboración con guías locales expertos y
					seleccionamos cuidadosamente proveedores de servicios confiables para garantizar que su viaje sea
					enriquecedor y en sintonía con la belleza natural y la rica historia de cada provincia que visiten.
					Además, nos esforzamos por fomentar un turismo sostenible y responsable, respetando y preservando el
					entorno y las comunidades locales.
				</Typography>
				<Typography color="gray" className="font-normal text-justify">
					En Cooperativa de Transporte Turismo La Maná, nuestra misión es superar sus expectativas y convertir
					sus sueños de viaje en realidad. Ya sea que deseen descubrir la magia de las playas de la región
					costa, adentrarse en la selva amazónica o explorar los tesoros históricos de Quito, estamos aquí
					para guiarles en cada paso del camino y asegurarnos de que se sumerjan en la diversidad y la riqueza
					cultural de Ecuador.
				</Typography>
				<Card className="my-8 overflow-hidden">
					<Image
						fetchPriority="auto"
						alt="nature"
						height={800}
						width={800}
						className="h-[24rem] w-full object-cover object-center"
						src="https://cdn.pixabay.com/photo/2013/02/20/11/30/llamas-83780_1280.jpg"
					/>
				</Card>

				<Typography color="gray" className="font-normal text-justify">
					¡Prepárense para una aventura inolvidable con Cooperativa de Transporte Turismo La Maná! Estamos
					ansiosos por ser su compania de viaje confiable y llevarles a descubrir los tesoros ocultos de este
					hermoso país.
				</Typography>
			</div>
		</LayoutHome>
	)
}

export default Home

/** <
			<GlobalProvider>
				<div className="grid min-h-screen">
					<div className="px-5 sm:px-8 md:px-12 lg:mx-46 xl:mx-86 2xl:mx-86 my-auto">
						<div className="flex justify-center items-center">
							<ExpenseChart />
						</div>
						<TansactionExpense />
						<Balance />
						<TransactionForm />
						<TransactionList />
					</div>
				</div>
			</GlobalProvider>
		</>
		
		*/
