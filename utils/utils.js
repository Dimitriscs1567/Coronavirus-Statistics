export const formatNumber = (num) => {
    if(!num){
        return 0;
    }

    if(num.toString().charAt(0) === '+'){
        num = num.substring(1, num.length);
    }

    let stringNum = num.toString();
    const length = stringNum.length;
    const exact = length % 3 === 0;
    const dots = exact ? Math.floor(length / 3) - 1 : Math.floor(length / 3);
   
    for(let i=1; i<=dots; i++){
        const dotIndex = length - (i*3);
        
        stringNum = stringNum.substring(0, dotIndex) 
                    + '.' 
                    +  stringNum.substring(dotIndex, length + (i-1));
    }

    return stringNum;
}

export const  getPercent = (country, type) => {

    if(type === 'critical'){
        if(country.cases.critical === 0 || country.cases.active === 0){
            return 0 + "%";
        }

        return (country.cases.critical * 100 / country.cases.active)
                .toFixed(1).toString() + "%";
    }
    else{
        if(country.deaths.total === 0 || country.cases.total === 0){
            return 0 + "%";
        }

        return (country.deaths.total * 100 / country.cases.total)
                .toFixed(1).toString() + "%";
    }
}

export const formatDate = (date) => {
    const dateString = date.toISOString();

    return dateString.split('T')[0];
}

export const formatDateForChart = (date) => {
    const dateString = date.toISOString();

    const parts = dateString.split('T')[0].split('-');

    return parts[2]  + '/' + parts[1];
} 