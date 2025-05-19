import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Github, Twitter, Linkedin } from "lucide-react";
import axios from "axios";
import { toast, Toaster } from "sonner";

export function Footer() {
  const handleNewsletter = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");

    try {
      const response = await axios.post('http://localhost:5000/newsletter/subscribe', {
        email: email
      });

      toast.success(response.data.message || "Subscribed to tech insights!");
      e.target.reset();
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          toast.info(error.response.data.message || "You're already subscribed!");
        } else {
          toast.error('Subscription failed. Try again.');
        }
      } else {
        toast.error('Network error - check connection');
      }
    }
  };

  return (
    <footer className="w-full border-t bg-background dark:bg-[#0B0B0F] z-50">
      <Toaster position="bottom-right" />
      <div className="container px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">

          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-1"
          >
            <h2 className="text-2xl font-bold tracking-tighter">satyammjha</h2>
            <p className="text-sm font-semibold text-muted-foreground">
              Building digital experiences
            </p>
          </motion.div>

          {/* Essential Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm">
              {['About', 'Blog', 'Projects', 'Tools'].map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ y: 10, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <a
                    href={`/${item.toLowerCase()}`}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={`View ${item} page`}
                  >
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Policies</h3>
            <ul className="space-y-2 text-sm">
              {['Privacy', 'Terms', 'Security'].map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ y: 10, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.1 }}
                >
                  <a
                    href={`/${item.toLowerCase()}`}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={`View ${item} policy`}
                  >
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Stay Updated</h3>
            <form onSubmit={handleNewsletter} className="flex w-full max-w-md gap-2">
              <Input
                name="email"
                type="email"
                placeholder="Email for tech insights"
                className="bg-background"
                aria-label="Subscribe to newsletter"
                required
              />
              <Button type="submit" variant="default" aria-label="Subscribe">
                Subscribe
              </Button>
            </form>

            <div className="flex gap-4 pt-4">
              {[
                { icon: Github, href: "https://github.com/satyammjha" },
                { icon: Twitter, href: "https://twitter.com/satyammjha" },
                { icon: Linkedin, href: "https://linkedin.com/in/satyammjha" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-full p-2 hover:bg-muted transition-colors"
                  aria-label={`Visit ${social.icon.displayName} profile`}
                >
                  <social.icon className="h-5 w-5 text-muted-foreground" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground"
        >
          © {new Date().getFullYear()}
        </motion.div>
      </div>
    </footer>
  );
}