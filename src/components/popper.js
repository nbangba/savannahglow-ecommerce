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
      max-width:100%;
      overflow:hidden;
      
  `
  export const MenuContentList = styled.li`
      width:100%;
      display:block;
      font-family: 'Montserrat', sans-serif;
      color:#35486F;
      background-color:${props=> props.bg||''};
      margin:5px;
      font-size:18px;
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
  const { styles, attributes ,update, } = usePopper(referenceElement, popperElement, {
    modifiers: [{ name: 'arrow', options: { element: arrowElement } },{name:'offset',options:{offset:[-18,0]}}],
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
  
// used to close menu on click outside. replaced with tab ondex and onblur
  const handleClickOutside = (e)=>{
    if(open){
     const tooltip = document.getElementsByClassName('tooltip-enter-done')[0]
     console.log(e.target)
      if (tooltip && !tooltip.contains(e.target)) {
        setOpen(false)
      }
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  const tooltip = {
    width:'120px',
    backgroundColor:'#EBDDD2',
    fontWeight: 'normal',
    padding:' 4px 8px',
    fontSize: '18px',
    borderRadius: '4px',
    marginTop: '10px',
    boxShadow:'2px 2px 20px 5px rgba(0, 0, 0, 0.2)',
  }
  
  
  return (
    <>
       {children(setReferenceElement,setOpen,open)}
     <CSSTransition in={open} timeout={200} unmountOnExit  classNames='tooltip'>
     <div  style={{...styles.popper,...tooltip}}  ref={setPopperElement}  {...attributes.popper}>
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