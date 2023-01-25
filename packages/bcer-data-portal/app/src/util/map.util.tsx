import { BCDirectionData, BusinessLocation } from "@/constants/localInterfaces";
import React from "react";

export class MapUtil {
    static formatLocationsForPDF(locations: BusinessLocation[], routeData: BCDirectionData) {
        return {
            locations : locations.map(({ id, addressLine1, postal, city }, index) => {
                            return <div key = {id} style={{paddingBottom: 10, fontSize: 10, width: '100%'}}>
                                        <div style={{fontWeight: 'bold', color: 'black', paddingBottom: 5}}>{`Location ${index+1}`}</div>
                                        <div style={{fontSize: 10, width: '100%', color: 'grey'}}>
                                            {addressLine1}  
                                            <div>{`${postal}, ${city}`}</div>
                                        </div>
                                    </div>
                        }),
            directions: routeData.directions.map(({ type, text}, index) => {
                            return <div key={index} style={{paddingBottom: 12, fontSize: 10, width: '100%'}}>
                                        <div style={{fontWeight: 'bold',  color: 'black', paddingBottom: 3}}>{type}</div>
                                        <div style={{color: 'grey'}}>
                                            {text}
                                        </div>
                                    </div>
                        })
        };
      }
}