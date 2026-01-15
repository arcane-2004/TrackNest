import React, { useState } from 'react';
import GaugeComponent from 'react-gauge-component';

const RadialGauge = () => {


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-800">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-8">
                    Radial inner ticks
                </h1>


                <GaugeComponent
                    type="semicircle"
                    arc={{
                        colorArray: ['#00FF15', '#FF2121'],
                        padding: 0.02,
                        subArcs:
                            [
                                { limit: 40 },
                                { limit: 60 },
                                { limit: 70 },
                                {},
                                {},
                                {},
                                {}
                            ]
                    }}
                    pointer={{ type: "blob", animationDelay: 0 }}
                    value={80}
                />
            </div>
        </div>
    );
};

export default RadialGauge;