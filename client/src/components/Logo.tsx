import logoSrc from "@/assets/rhizea-logo.png";

type LogoProps = {
  /** Alto del isotipo en px. El ancho se ajusta solo (proporción real ~284x322). */
  size?: number;
  /** Si es true, muestra el isotipo junto al nombre "Rhizea" en texto. */
  withText?: boolean;
  className?: string;
};

export function Logo({ size = 32, withText = false, className = "" }: LogoProps) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <img
        src={logoSrc}
        alt="Rhizea"
        style={{ height: size, width: "auto" }}
        draggable={false}
      />
      {withText && (
        <span className="text-2xl font-bold text-primary">Rhizea</span>
      )}
    </div>
  );
}
