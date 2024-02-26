import React from 'react'

import "./TwoFactorValidationStyle.css"
import TowFactorForm from './TowFactorForm/TowFactorForm'
import Header from '../../components/Header/Header'

function TwoFactorValidation() {
  return (
    <>
        <Header isConnected={true} />
        <section className="two-factor-validation-section container">
            <div className="two-factor-validation-content">
                <div className="two-factor-validation-header">
                    <div className="two-factor-validation-title">
                        Two Factor Validation
                    </div>
                </div>
                <div className="two-factor-validation-body">
                    <div className="qr-code-image">
                        <img src={process.env.PUBLIC_URL + "/images/qr-code.png"} alt="QR code" />
                    </div>
                    <TowFactorForm />
                </div>
            </div>
        </section>
    
    </>


  )
}

export default TwoFactorValidation
