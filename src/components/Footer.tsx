import Container from "./Container";

const Footer = () => {
  return (
    <footer className="mt-6 mb-8">
      <Container>
        <p>Invoice Ledger &copy; {new Date().getFullYear()}</p>
      </Container>
    </footer>
  );
};

export default Footer;
