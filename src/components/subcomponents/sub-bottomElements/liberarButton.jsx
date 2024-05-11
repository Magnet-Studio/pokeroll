import React from "react";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import { useState } from "react";
import "./styles/liberarButton.css";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import PokemonCard from "../sub-gameStatus/pokemonCard";
import CoinImage from "../../../images/coin.png";
import { DeletePokemon } from "../sub-gameStatus/userdata/pokemonList";
import { Link } from 'react-router-dom';


const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40vw",
  bgcolor: "white",
  boxShadow: 24,
  p: 4,
  borderRadius: "2vw",
};

const coinValues = [50, 250, 750, 2000, 5000, 5000]

function LiberarButton({ data , UserData, SetUserData}) {

  const [isHovered, setIsHovered] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const LiberarPokemon = () => Liberar(data, UserData, SetUserData);

  return (
    <div>
      <Button onClick={handleOpen}>
        <div
          className={"liberarButton " + (isHovered ? "mouseleave" : "")}
          onMouseEnter={() => setIsHovered(false)}
          onMouseLeave={() => setIsHovered(true)}
        >
          <CurrencyExchangeIcon />
          <p className="liberarButtonTitle">Liberar</p>
        </div>
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
            ¿Quieres liberar a este Pokémon?
          </Typography>
          <Typography id="modal-modal-description" variant="h6" component="h2">
            {"Liberar a " + data.nametag + " supondrá perderlo para siempre, pero recibirás " + coinValues[data.tier-1] + " monedas a cambio. (No perderás su registro en la Pokédex)"}
          </Typography>
          <div className="containerModal">
            <PokemonCard data={data} />
          </div>
          <div className="containerModal moneyCount">
            <img className="coin" src={CoinImage} alt="coin" /> {"+" + coinValues[data.tier-1]}
          </div>
          <div className="containerModal">
            <Button
              className="cerrarButton"
              onClick={handleClose}
              style={{
                backgroundColor: "#fb6c6c" /* color de fondo */,
                color: "white" /* color del texto */,
                padding: "14px 20px" /* padding */,
                border: "0.2vw solid #9f4949" /* sin borde */,
                borderRadius: "1vw" /* bordes redondeados */,
                cursor: "pointer" /* cursor de mano al pasar por encima */,
                fontSize: "calc(0.5vw + 0.9vh)" /* tamaño de la fuente */,
                width: "8vw",
                pointerEvents: "all",
                fontFamily: "vanilla-regular",
              }}
            >
              Cancelar
            </Button>
            <Link to="/almacen">
            <Button
              className="confirmarButton"
              onClick={LiberarPokemon}
              style={{
                backgroundColor: "#00DF09" /* color de fondo */,
                color: "#ffffff" /* color del texto */,
                padding: "14px 20px" /* padding */,
                border: "0.2vw solid #89ff8e" /* sin borde */,
                borderRadius: "1vw" /* bordes redondeados */,
                cursor: "pointer" /* cursor de mano al pasar por encima */,
                fontSize: "calc(0.5vw + 0.9vh)" /* tamaño de la fuente */,
                width: "8vw",
                marginLeft: "1.5vw",
                pointerEvents: "all",
                fontFamily: "vanilla-regular",
              }}
            >
              Liberar
            </Button>
            </Link>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

function Liberar(data, UserData, SetUserData) 
{
  DeletePokemon(data.id, coinValues[data.tier - 1], UserData, SetUserData);
  
} 

export default LiberarButton;