import Container from "./Container";

const Footer = () => {
  return (
    <footer className="mt-6 mb-8">
      <Container>
        <p>InvoLuxe &copy; {new Date().getFullYear()}</p>
      </Container>
    </footer>
  );
};

export default Footer;
