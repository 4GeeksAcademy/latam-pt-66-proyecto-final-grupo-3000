export const Footer = () => (
	<footer className="py-3 bg-primary text-white text-center mt-5">
		<div className="container">
			<span className="me-3">
				<i className="fa-solid fa-list-check me-1"></i>
				<strong>Habit Tracker</strong> &copy; {new Date().getFullYear()}
			</span>
			<span>Construye mejores hábitos, un día a la vez.</span>
		</div>
	</footer>
);
