import * as Icons from "lucide-react";
import { SiReact, SiSvelte, SiGithub } from "@icons-pack/react-simple-icons";

export const IconObject = {
  home: Icons.House,
  chevronRight: Icons.ChevronRight,
  email: Icons.Mail,
  download: Icons.Download,
  externalLink: Icons.ExternalLink,
  copy: Icons.Copy,
  checkCircle: Icons.CheckCircle2,
  image: Icons.Image,
  codeXml: Icons.CodeXml,
  ellipsis: Icons.Ellipsis,
  react: SiReact,
  svelte: SiSvelte,
  github: SiGithub,
};

export type IconName = keyof typeof IconObject;

export interface Icon {
  icon: IconName;
  size?: number;
}
