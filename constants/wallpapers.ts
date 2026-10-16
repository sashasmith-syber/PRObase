import React from 'react';

export interface Wallpaper {
  id: string;
  name: string;
  style: React.CSSProperties;
}

export const WALLPAPERS: Wallpaper[] = [
  {
    id: 'grid',
    name: 'Green Grid',
    style: {
      backgroundColor: '#080a08',
      backgroundImage: `
        linear-gradient(rgba(163, 230, 53, 0.07) 1px, transparent 1px),
        linear-gradient(90deg, rgba(163, 230, 53, 0.07) 1px, transparent 1px)
      `,
      backgroundSize: '40px 40px',
      backgroundPosition: '-1px -1px',
    },
  },
  {
    id: 'blueprint',
    name: 'Blueprint',
    style: {
      backgroundColor: '#020f2a',
      backgroundImage: `
        linear-gradient(rgba(50, 150, 255, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(50, 150, 255, 0.1) 1px, transparent 1px),
        linear-gradient(rgba(50, 150, 255, 0.05) 2px, transparent 2px),
        linear-gradient(90deg, rgba(50, 150, 255, 0.05) 2px, transparent 2px)
      `,
      backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
      backgroundPosition: '-2px -2px, -2px -2px, -1px -1px, -1px -1px',
    },
  },
  {
    id: 'circuit',
    name: 'Circuit',
    style: {
        backgroundColor: '#0a0c0a',
        backgroundImage: `
          linear-gradient(0deg, transparent 24%, rgba(163, 230, 53, .08) 25%, rgba(163, 230, 53, .08) 26%, transparent 27%, transparent 74%, rgba(163, 230, 53, .08) 75%, rgba(163, 230, 53, .08) 76%, transparent 77%, transparent),
          linear-gradient(90deg, transparent 24%, rgba(163, 230, 53, .08) 25%, rgba(163, 230, 53, .08) 26%, transparent 27%, transparent 74%, rgba(163, 230, 53, .08) 75%, rgba(163, 230, 53, .08) 76%, transparent 77%, transparent)
        `,
        backgroundSize: '50px 50px',
    },
  },
  {
    id: 'dots',
    name: 'Subtle Dots',
    style: {
      backgroundColor: '#050505',
      backgroundImage: `radial-gradient(circle, rgba(163, 230, 53, 0.1) 1px, transparent 1px)`,
      backgroundSize: '20px 20px',
    },
  },
  {
    id: 'hexagon',
    name: 'Hexagon',
    style: {
      backgroundColor: '#101010',
      backgroundImage: 'linear-gradient(30deg, rgba(163, 230, 53, 0.02) 12%, transparent 12.5%, transparent 87%, rgba(163, 230, 53, 0.02) 87.5%, rgba(163, 230, 53, 0.02)), linear-gradient(150deg, rgba(163, 230, 53, 0.02) 12%, transparent 12.5%, transparent 87%, rgba(163, 230, 53, 0.02) 87.5%, rgba(163, 230, 53, 0.02)), linear-gradient(30deg, rgba(163, 230, 53, 0.02) 12%, transparent 12.5%, transparent 87%, rgba(163, 230, 53, 0.02) 87.5%, rgba(163, 230, 53, 0.02)), linear-gradient(150deg, rgba(163, 230, 53, 0.02) 12%, transparent 12.5%, transparent 87%, rgba(163, 230, 53, 0.02) 87.5%, rgba(163, 230, 53, 0.02)), linear-gradient(60deg, rgba(163, 230, 53, 0.03) 25%, transparent 25.5%, transparent 75%, rgba(163, 230, 53, 0.03) 75%, rgba(163, 230, 53, 0.03)), linear-gradient(60deg, rgba(163, 230, 53, 0.03) 25%, transparent 25.5%, transparent 75%, rgba(163, 230, 53, 0.03) 75%, rgba(163, 230, 53, 0.03))',
      backgroundSize: '80px 140px',
      backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px'
    }
  },
  {
    id: 'scanlines',
    name: 'Scanlines',
    style: {
      backgroundColor: '#080808',
      backgroundImage: `repeating-linear-gradient(
        0deg,
        rgba(128, 255, 128, 0.07),
        rgba(128, 255, 128, 0.07) 1px,
        transparent 1px,
        transparent 3px
      )`,
    },
  },
  {
    id: 'binary_code',
    name: 'Binary Code',
    style: {
      backgroundColor: '#010801',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Ctext x='0' y='15' font-family='monospace' font-size='10' fill='rgba(163, 230, 53, 0.1)'%3E011010010110%3C/text%3E%3Ctext x='0' y='30' font-family='monospace' font-size='10' fill='rgba(163, 230, 53, 0.1)'%3E101001101001%3C/text%3E%3Ctext x='0' y='45' font-family='monospace' font-size='10' fill='rgba(163, 230, 53, 0.1)'%3E001101001110%3C/text%3E%3Ctext x='0' y='60' font-family='monospace' font-size='10' fill='rgba(163, 230, 53, 0.1)'%3E110100101001%3C/text%3E%3Ctext x='0' y='75' font-family='monospace' font-size='10' fill='rgba(163, 230, 53, 0.1)'%3E010011010110%3C/text%3E%3Ctext x='0' y='90' font-family='monospace' font-size='10' fill='rgba(163, 230, 53, 0.1)'%3E101010011001%3C/text%3E%3C/svg%3E")`,
    },
  },
  {
    id: 'glitch_grid',
    name: 'Glitch Grid',
    style: {
      backgroundColor: '#000000',
      backgroundImage: `
        linear-gradient(0deg, rgba(0, 255, 255, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 0, 0, 0.05) 1px, transparent 1px),
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
      `,
      backgroundSize: '50px 50px, 50px 50px, 10px 10px, 10px 10px',
      backgroundPosition: '2px 0px, 0px 2px, 0px 0px, 0px 0px',
    },
  },
  {
    id: 'red_alert',
    name: 'Red Alert',
    style: {
      backgroundColor: '#100505',
      backgroundImage: `
        linear-gradient(rgba(255, 50, 50, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 50, 50, 0.1) 1px, transparent 1px)
      `,
      backgroundSize: '30px 30px',
      backgroundPosition: '-1px -1px',
    },
  },
  {
    id: 'network_grid',
    name: 'Network Grid',
    style: {
      backgroundColor: '#040814',
      backgroundImage: `
        radial-gradient(circle at 1px 1px, rgba(100, 180, 255, 0.2), transparent 2px),
        linear-gradient(rgba(100, 180, 255, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(100, 180, 255, 0.05) 1px, transparent 1px)
      `,
      backgroundPosition: '0 0, 0 0, 0 0',
      backgroundSize: '25px 25px, 25px 25px, 25px 25px',
    }
  },
  {
    id: 'hud',
    name: 'Targeting HUD',
    style: {
        backgroundColor: '#0a1014',
        backgroundImage: `
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cpath d='M 100 0 L 100 20 M 100 180 L 100 200 M 0 100 L 20 100 M 180 100 L 200 100' stroke='rgba(255,80,80,0.3)' stroke-width='1'/%3E%3Ccircle cx='100' cy='100' r='30' stroke='rgba(255,80,80,0.3)' stroke-width='1' fill='none'/%3E%3Cpath d='M 20 20 L 20 40 L 40 20 Z M 180 20 L 160 20 L 180 40 Z M 20 180 L 40 180 L 20 160 Z M 180 180 L 180 160 L 160 180 Z' fill='rgba(255,80,80,0.15)'/%3E%3C/svg%3E")
        `
    }
  },
  {
    id: 'glitch_lines',
    name: 'Glitch Lines',
    style: {
      backgroundColor: '#010101',
      backgroundImage: `
        repeating-linear-gradient(
          60deg,
          transparent,
          transparent 10px,
          rgba(0, 255, 255, 0.05) 10px,
          rgba(0, 255, 255, 0.05) 12px
        ),
        repeating-linear-gradient(
          150deg,
          transparent,
          transparent 8px,
          rgba(255, 0, 150, 0.05) 8px,
          rgba(255, 0, 150, 0.05) 10px
        )
      `,
    }
  },
];
