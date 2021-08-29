import React, { useState,useEffect } from 'react';
import { usePopper} from 'react-popper';
import styled from 'styled-components'
import { CSSTransition } from 'react-transition-group';
import fb from '../firebase/fbconfig'


export const MenuContent = styled.ul`
      display:flex;
      flex-wrap:wrap;
      text-align:start;
      justify-content:center;
      padding:0;
      width:100%;
      
      
  `
  export const MenuContentList = styled.li`
      width:100%;
      display:block;
      font-family: 'Montserrat', sans-serif;
      color:#35486F;
      background-color:${props=> props.bg||''};
      
      text-align:left;   

      a{
        box-sizing: border-box;
        width:100%;
        display:inline-block;
        padding:${props=> props.padding||'5px'};
        color:black;
        text-decoration:none;
        &:hover{
          text-decoration:none;
          font-weight:bold;
        }
    }
  `

const Popper = ({subMenuItems,children}) => {

  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);
  const { styles, attributes ,update} = usePopper(referenceElement, popperElement, {
    modifiers: [{ name: 'arrow', options: { element: arrowElement } },{name:'offset',options:{x:-8,y:0}}],
  });

  const [open,setOpen] = useState(false)

  useEffect(() => {
    if(open && update)
     update()
  }, [open])
  
  const signOut = ()=>{
     fb.auth().signOut().then(()=>{
       console.log('you are signed out')
     })
  }

  const tooltip = {
    width:'100px',
    backgroundColor:'#EBDDD2',
    fontWeight: 'normal',
    padding:' 4px 8px',
    fontSize: '16px',
    borderRadius: '4px',
    marginTop: '10px',
    boxShadow:'2px 2px 20px 5px rgba(0, 0, 0, 0.2)',
  }
  
  
  return (
    <>
       {children(setReferenceElement,setOpen,open)}
     <CSSTransition in={open} timeout={200} unmountOnExit  classNames='tooltip'>
     <div style={{...styles.popper,...tooltip}} ref={setPopperElement}  {...attributes.popper}>
        <MenuContent>
            {subMenuItems.map((item,index)=> 
              <MenuContentList key={index}>
                  <a href='' >{item}</a>
              </MenuContentList>
            )}
            <MenuContentList key={4} onClick={signOut}>
                  Sign Out
              </MenuContentList>
        </MenuContent>
        <div ref={setArrowElement} style={styles.arrow} />
      </div>
     </CSSTransition>
      
    </>
  );
};

export default Popper