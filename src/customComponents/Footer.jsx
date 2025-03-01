import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, Instagram } from "lucide-react";

export function Footer() {
  const handleNewsletter = (e) => {
    e.preventDefault();
  };

  return (
    <footer className="w-full border-t bg-background dark:bg-[#0B0B0F] z-50">
      <div className="container px-4 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">

          <div className="space-y-4 md:col-span-2 lg:col-span-1">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold tracking-tighter">satyammjha</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Building the future of digital experiences
              </p>
            </motion.div>
          </div>


          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company</h3>
            <ul className="space-y-2 text-sm">
              {['About', 'Careers', 'Blog', 'Press'].map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <a
                    href="#"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              {['Privacy', 'Terms', 'Cookie Policy', 'Contact'].map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  <a
                    href="#"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 md:col-span-2 lg:col-span-2">
            <h3 className="text-lg font-semibold">Stay Updated</h3>
            <form onSubmit={handleNewsletter} className="flex w-full max-w-md gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-background"
              />
              <Button type="submit" variant="default">
                Subscribe
              </Button>
            </form>

            <div className="flex gap-4 pt-4">
              {[
                { icon: Github, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Linkedin, href: "#" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="rounded-full p-2 transition-colors hover:bg-muted"
                >
                  <social.icon className="h-5 w-5 text-muted-foreground" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            © {new Date().getFullYear()}-satyammjha
          </motion.div>
        </div>
      </div>
    </footer>
  );
}