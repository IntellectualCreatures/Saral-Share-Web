import Image from 'next/image'
import QRCode from 'qrcode.react';
import { useEffect, useState } from "react";
import Head from 'next/head'
import { connect } from "socket.io-client";
import JsonWebToken from 'jsonwebtoken'
export default function SaralShareWeb(props) {
  const [uniqueString, setUniqueString] = useState("")
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState("https://saralcode.com")
  // const [socket, setSocket]= useState();
  // let socket;
  

  useEffect(() => {
    async function func() {
      const socket =await connect("https://saralcode-server.herokuapp.com/api/apps/saralshare/web", { transports: ['websocket'] });
      
      socket.on("connect", (io) => {
        setUniqueString(JSON.stringify({ id: socket.id, key: props.data }));
      })

      socket.on("url", (data) => {
        setUrl(data)
        setOpen(true)
        const anchorElement = document.createElement("a")
        anchorElement.href = data;
        anchorElement.target = "blank"
        anchorElement.click()
      })

    }
    func();
  }, [])
  return (
    <main className='prose text-lg'>
    <section className="bg-gradient-to-br p-2 from-[#4d5dfb] min-h-screen to-[#08c8f6] prose-invert overflow-auto w-screen ">

      <Head>
        <title>Saral Share Web</title></Head>
      <h1 className="text-center p-2 md:p-0 md:border-0 pt-4">Saral Share Web</h1>

      <div className="mx-auto max-w-6xl border-4 p-4 rounded flex flex-col-reverse lg:flex-row lg:justify-between ">

        <div >
          <a rel="noreferrer" className='hover:scale-105 mx-auto block transform transition-all rounded-md overflow-hidden h-32 relative w-32' href="https://play.google.com/store/apps/details?id=com.saralcode.saralshare" target="_blank" >
            <Image alt='Saral Share Web' src="/saralshare.png" className='rounded-md' height={100} width={100} />
          </a>
          <h2 className='m-0 pt-2'>How to use? </h2>
          <ul className='text-white marker:text-white text-lg'>
            <li >Download <a className='text-white underline underline-offset-2' href="https://play.google.com/store/apps/details?id=com.saralcode.saralshare"  rel="noreferrer" target="_blank">Saral Share</a> app from Play Store</li>
            <li>Connect Your phone and PC with same network. Ex- Wifi Hotspot</li>
            <li>Scan this QR code with the App</li>
            <li>Now Share files without <strong>Internet</strong> and <strong>Data Usage</strong></li>
          </ul>

          <h2 className='m-0 pt-2'>Watch Tutorial</h2>
          <div className="aspect-w-16 aspect-h-9 m-1">
            <iframe  src="https://www.youtube.com/embed/9WHYE1lzdwI" className="ring-1 ring-white rounded" title="Saral Share | Share files between Android and PC via Wifi" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" loading='lazy' allowFullScreen ></iframe>
          </div>
            <a target="blank" rel="noreferrer" href="https://saralcode.com/apps/saralshare" className='text-white underline py-3'>Read full tutorial</a>
        </div>
        <div className='mx-auto md:mx-0 p-4 flex flex-col items-end'>
          {uniqueString == "" ?
            <div className={`p-4 h-36 w-36 mx-auto `} > <Image unoptimized src="/loading.svg" height={150} width={150} /></div> :

            <QRCode  value={uniqueString} bgColor="white" size={300} className={`mx-auto justify-end lg:mx-0 duration-300 bg-white rounded overflow-hidden transition-all ${open == true ? "h-0 w-0 p-0" : "p-4 h-64 w-64 sm:h-72 sm:w-72 md:w-80 md:h-80"} `} renderAs="svg" />}
          <div className={` mx-auto ${!open ? "w-0 h-0" : "h-auto"} align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:align-middle sm:max-w-lg sm:w-full`}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">

                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 as="h3" className="text-lg leading-6 font-medium text-gray-900">
                    Thanks for using Saral Share!
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Feeling great to see you here.😊 Click on the Open button to Open your IP
                    </p>
                    <a href={url} target="blank" className='font-bold no-underline text-blue-500'>{"\n" + url}</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <a
                href={url}
                target="blank"
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 outline-none ring-2 ring-offset-2 ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Open
              </a>
              <button
                onClick={() => {
                  setOpen(false)
                }}
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Re Scan
              </button>
            </div>
          </div>
        </div>
      </div>

    </section>
    </main>)
}

export async function getServerSideProps() {
  const key = JsonWebToken.sign({}, process.env.QRSECRET, { expiresIn: "1d" })
  return {
    props: {
      data: key
    }
  }
}
