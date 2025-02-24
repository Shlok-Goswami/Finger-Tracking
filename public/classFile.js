class Cursor{
  
    constructor(x,y,Image){
        this.x=x;
        this.y=y;
        this.Images=Image;
        this.mode="move";
    }
    setCoordinates(x,y){
        this.x=x;
        this.y=y;
    }
    
    setMode(x,y){
        let a=this.x-x;
        let b = this.y-y;
        if(Math.sqrt(a*a + b*b)<=50){
            this.mode="move";
        }
        else{
            this.mode="select";
        }
    }
}
export {Cursor};