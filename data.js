// Centralized communication script injected into iframe documents
const INJECTED_COMMUNICATION_SCRIPT = `
  window.addEventListener('message', (event) => {
    if(event.data && event.data.type === 'PORTAL_EVENT') {
      if (event.data.action === 'TAB_ACTIVE') {
        const h1 = document.querySelector('h1');
        if(h1) {
            h1.style.transform = 'scale(1.1)';
            setTimeout(() => { h1.style.transform = 'scale(1)'; }, 250);
        }
      } else if (event.data.action === 'TAB_INACTIVE') {
        const mediaElements = document.querySelectorAll('audio, video');
        mediaElements.forEach(media => {
          try { media.pause(); } catch(e) {}
        });
        const childFrames = document.querySelectorAll('iframe');
        childFrames.forEach(frame => {
          try {
            frame.contentWindow.postMessage({ type: 'PORTAL_EVENT', action: 'TAB_INACTIVE' }, '*');
          } catch(e) {}
        });
      }
    }
  });
`;

const SCREEN_CONTENTS = {
    menusaib: `
        <!DOCTYPE html>
        <html lang="th" class="bg-[#09090b] text-[#f4f4f5]">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Saib Portal</title>
          <script src="https://cdn.tailwindcss.com"><\/script>
        </head>
        <body class="font-sans m-0 antialiased bg-[#09090b] text-[#f4f4f5] min-h-screen relative flex flex-col items-center justify-center p-8 overflow-hidden">
           <h1 class="text-4xl font-normal text-blue-400 mb-4 transition-transform duration-300 ease-out">Saib</h1>
           <p class="text-gray-400 text-center max-w-md text-sm sm:text-base">This is the Saib section content. Fully optimized for fluid performance.</p>
        </body>
        </html>
    `,
    menumloog: `
        <!DOCTYPE html>
        <html lang="th" class="bg-[#09090b] text-[#f4f4f5]">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Mloog Portal</title>
          <script src="https://cdn.tailwindcss.com"><\/script>
        </head>
        <body class="font-sans m-0 antialiased bg-[#09090b] text-[#f4f4f5] min-h-screen relative flex flex-col items-center justify-center p-8 overflow-hidden">
           <h1 class="text-4xl font-normal text-purple-400 mb-4 transition-transform duration-300 ease-out">Mloog</h1>
           <p class="text-gray-400 text-center max-w-md text-sm sm:text-base">This is the Mloog section content with buttery smooth touch feedback.</p>
        </body>
        </html>
    `,
    menujiki: `
        <!DOCTYPE html>
        <html lang="en" class="bg-[#09090b] text-[#f4f4f5]">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>JIKI · Services & Security</title>
          <script src="https://cdn.tailwindcss.com"><\/script>
          <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"><\/script>
          <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"><\/script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
          <link rel="stylesheet" href="https://dl.dropbox.com/scl/fi/ioxzyv0v4cd89qrdnuzzx/style.css?rlkey=hpcs8e8knaz1uww19k9nqwm6e&st=z5i45y46&dl=0">
        </head>
        <body class="font-sans m-0 antialiased selection:bg-white/20 selection:text-white bg-[#09090b] text-[#f4f4f5] min-h-screen relative overflow-x-hidden">
          <div id="root"></div>
          <script type="text/babel" src="https://dl.dropbox.com/scl/fi/0i1bi79jmyi8qb8hy01wn/data.js?rlkey=jwnuuo2aitp84s5s0e9gpxfgq&st=86q2mzid&dl=0"><\/script>
          <script type="text/babel" src="https://dl.dropbox.com/scl/fi/nbxld2alla4qtlzswcjbw/script.js?rlkey=md3ur93ukougbh1q4o2wodcrr&st=lc1tihkr&dl=0"><\/script>
        </body>
        </html>
    `,
    menumuagtau: `
        <!DOCTYPE html>
        <html lang="th" class="bg-[#09090b] text-[#f4f4f5]">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Muagtau Portal</title>
          <script src="https://cdn.tailwindcss.com"><\/script>
        </head>
        <body class="font-sans m-0 antialiased bg-[#09090b] text-[#f4f4f5] min-h-screen relative flex flex-col items-center justify-center p-8 overflow-hidden">
           <h1 class="text-4xl font-normal text-green-400 mb-4 transition-transform duration-300 ease-out">Muagtau</h1>
           <p class="text-gray-400 text-center max-w-md text-sm sm:text-base">Experience natural motion curves and responsive layout shifts.</p>
        </body>
        </html>
    `,
    menuKawm: `
        <!DOCTYPE html>
        <html lang="th" class="bg-[#09090b] text-[#f4f4f5]">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Kawm Portal</title>
          <script src="https://cdn.tailwindcss.com"><\/script>
        </head>
        <body class="font-sans m-0 antialiased bg-[#09090b] text-[#f4f4f5] min-h-screen relative flex flex-col items-center justify-center p-8 overflow-hidden">
           <h1 class="text-4xl font-normal text-yellow-400 mb-4 transition-transform duration-300 ease-out">Kawm</h1>
           <p class="text-gray-400 text-center max-w-md text-sm sm:text-base">This is the Kawm section content.</p>
        </body>
        </html>
    `
};

const NAV_DATA = [
    { id: 'menusaib', title: 'SAiB', icon: 'https://dl.dropbox.com/scl/fi/qn5vew8bef5fjr2w1rrzl/Picsart_24-12-09_06-00-59-196.png' },
    { id: 'menumloog', title: 'Mloog', icon: 'https://dl.dropbox.com/scl/fi/qn5vew8bef5fjr2w1rrzl/Picsart_24-12-09_06-00-59-196.png' },
    { id: 'menujiki', title: 'JIKI', icon: 'https://dl.dropbox.com/scl/fi/63e7b9auimp9zs35bx07z/Picsart_26-09-20_21-24-22-231.png?rlkey=90g3shmfyggrjtwiromvvzxox&st=e16dpgaq&dl=0' },
    { id: 'menumuagtau', title: 'Muagtau', icon: 'https://dl.dropbox.com/scl/fi/qn5vew8bef5fjr2w1rrzl/Picsart_24-12-09_06-00-59-196.png' },
    { id: 'menuKawm', title: 'Kawm', icon: 'https://dl.dropbox.com/scl/fi/ijk2buakubum33k825j94/Picsart_25-04-06_20-47-01-361.png' }
];
