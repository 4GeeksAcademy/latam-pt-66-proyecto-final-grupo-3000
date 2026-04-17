export const Footer = () => (
	<footer className="footer mt-auto py-3 bg-primary text-white text-center">
		<div className="container">
			<span className="me-3">
				<i className="fa-solid fa-list-check me-1"></i>
				<strong>Habit Tracker</strong> &copy; {new Date().getFullYear()}
			</span>
			<span>Construye mejores hábitos, un día a la vez.</span>
		</div>
	</footer>
);
