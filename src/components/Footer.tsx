import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    "Movies Now Showing": ["Pushpa 2", "Dune: Part Two", "Animal", "Jawan", "Salaar"],
    "Upcoming Movies": ["Avatar 3", "Deadpool 4", "Mission Impossible 8", "Fast X Part 2"],
    "Help": ["About Us", "Contact Us", "FAQs", "Terms & Conditions", "Privacy Policy"],
  };

  const socialLinks = [
    { icon: Facebook, label: "Facebook" },
    { icon: Twitter, label: "Twitter" },
    { icon: Instagram, label: "Instagram" },
    { icon: Youtube, label: "YouTube" },
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
                {title}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
              Follow Us
            </h4>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="p-2 bg-muted rounded-full text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-2xl font-bold">
            <span className="text-primary">book</span>
            <span className="text-foreground">my</span>
            <span className="text-foreground">show</span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            © 2024 BookMyShow Clone. All rights reserved. Built for demonstration purposes.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
