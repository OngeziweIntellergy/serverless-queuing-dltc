import React from 'react'
import './Display.css'

function Display() {
  return (
    <div className='container'>
        <div className='top'>
         <div className='container-left'>
                <div className='container-qr'>
                    <img src={require('./../../assets/img/qrcode.png')}/>
                </div>
                <div className='container'>

                </div>

            </div>
        
            <div className='container-right'>
                <div className='logo-area'>
                    <img src={require('./../../assets/img/qrcode.png')} />
                </div>
                <div className="q-area">
                    <table>
                        <tr>
                            <th>Now Serving</th>
                            <th>Consultant</th>
                        </tr>
                        <tr>
                            <td># 355621</td>
                            <td>1</td>
                        </tr>
                        <tr>
                            <td># 355621</td>
                            <td>1</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <div className="bottom">
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing.</p>

        </div>
        

      
    </div>
  )
}

export default Display


