import {
  Card,
  Grid,
  Link,
  Slide,
  Typography,
  CircularProgress,
  TableCell,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Select,
  Button,
  List,
  ListItem,
  MenuItem,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import Router from 'next/router';
import React, { useContext } from "react";
import Layout from "../components/Layout";
import { Store } from "../components/Store";
import getCommerce from "../utils/commerce";
import { CART_RETRIEVE_SUCCESS } from "../utils/constants";
import { useStyles } from "../utils/styles";
import dynamic from 'next/dynamic';

function Cart(props) {
  const classes = useStyles();
  
  const { state, dispatch } = useContext(Store)
  const { cart } = state;

  const removeFromCartHandler = async (lineItem) => {
      const commerce = getCommerce(props.commercePublicKey);
      const cartData = await commerce.cart.remove(lineItem.id);
      dispatch({ type: CART_RETRIEVE_SUCCESS, payload: cartData.cart });
  };

  const quantityChangeHnadler = async (lineItem, quantity) => {
      const commerce = getCommerce(props.commercePublicKey);
      const cartData = await commerce.cart.update(lineItem.id, {
          quantity,
      });
      dispatch({ type: CART_RETRIEVE_SUCCESS, payload: cartData.id });
  };

  const proccessToCheckoutHandler = () => {
      Router.push('/checkout')
  }
  return (
    <Layout title="Home" commercePublicKey={props.commercePublicKey}>
        {cart.loading ? (
            <CircularProgress />
        ): cart.data.line_items.length === 0 ? (
            <Alert icon={false} severity="error">
                El carrito esta vacio. <Link href="/">Ir a compras</Link>
            </Alert>
        ):(
            <React.Fragment>
                <Typography variant="h1" component="h1">
                    Carrito de compras
                </Typography>
                <Slide direction="up" in={true}>
                    <Grid container spacing={1}>
                        <Grid item md={9}>
                            <TableContainer>
                                <Table aria-label="Orders">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Nombre</TableCell>
                                            <TableCell align="right">Cantidad</TableCell>
                                            <TableCell align="right">Precio</TableCell>
                                            <TableCell>Accion</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {cart.data.line_items.map((cartItem) => (
                                            <TableRow key={cartItem.name}>
                                                <TableCell component="th" scope="row">
                                                    {cartItem.name}
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Select
                                                        labelId="quantity-label"
                                                        id="quantity"
                                                        onChange={(e) => 
                                                        quantityChangeHnadler(
                                                            cartItem,
                                                            e.target.value
                                                        )}
                                                        value={cartItem.quantity}
                                                    >
                                                        {[...Array(10).keys()].map((x) => (
                                                            <MenuItem key={ x+1} value={x+1}>
                                                                {x+1}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </TableCell>
                                                <TableCell align="any">
                                                    {cartItem.price.formatted_with_symbol}
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Button
                                                        onClick={() => removeFromCartHandler(cartItem)}
                                                        variant="contained"
                                                        color="secondary"
                                                    >
                                                        X
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid item md={3} xs={12}>
                            <Card className={classes.card}>
                                <List>
                                    <ListItem>
                                        <Grid container>
                                            <Typography variant="h6">
                                                Subtotal: {cart.data.subtotal.formatted_with_symbol}
                                            </Typography>
                                        </Grid>
                                    </ListItem>
                                    <ListItem>
                                        {cart.data.total_items > 0 && (
                                            <Button
                                                type="button"
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                                onClick={proccessToCheckoutHandler}
                                            >
                                                Pagar
                                            </Button>
                                        )}
                                    </ListItem>
                                </List>
                            </Card>
                        </Grid>
                    </Grid>
                </Slide>
            </React.Fragment>
        )}
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(Cart), {
    ssr: false,
});