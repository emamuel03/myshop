import React, { useContext } from 'react';
import { Alert } from '@material-ui/lab';
import Layout from '../components/Layout';
import { Store } from '../components/Store';
import {
  Card,
  Grid,
  List,
  ListItem,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import { useStyles } from '../utils/styles';
import dynamic from 'next/dynamic';

function Confirmation(props) {
  const classes = useStyles();
  const { state } = useContext(Store);
  const { order } = state;
  console.log(order);
  return (
    <Layout commercePublicKey={props.commercePublicKey} title="Order Details">
      {!order ? (
        <Alert icon={false} severity="error">
          Orden no encontrada.
        </Alert>
      ) : (
        <React.Fragment>
          <Typography variant="h1" component="h1">
            Orden {order.id}
          </Typography>
          <Slide direction="up" in={true}>
            <Grid container spacing={1}>
              <Grid item md={9}>
                <Card className={classes.p1}>
                  <Typography variant="h2" component="h2">
                    Datos del cliente
                  </Typography>
                  <Typography>
                    {order.customer.firstname} {order.customer.lastname}
                  </Typography>
                  <Typography>{order.customer.email}</Typography>
                </Card>
                <Card className={[classes.p1, classes.mt1]}>
                  <Typography variant="h2" component="h2">
                    Detalles del envio
                  </Typography>
                  <Typography>{order.shipping.name}</Typography>
                  <Typography>{order.shipping.street}</Typography>
                  <Typography>
                    {order.shipping.town_city}, {order.shipping.county_state}{' '}
                    {order.shipping.postal_zip_code}
                  </Typography>
                  <Typography> {order.shipping.country}</Typography>
                </Card>
                <Card className={[classes.p1, classes.mt1]}>
                  <Typography variant="h2" component="h2">
                    Detalles del Pago
                  </Typography>
                  {order.transactions && order.transactions[0] ? (
                    <>
                      <Typography>
                        {order.transactions[0].gateway_name}
                      </Typography>
                      <Typography>
                        Tarjeta terminada en {order.transactions[0].gateway_reference}
                      </Typography>
                      <Typography>
                        Transaccion ID:{' '}
                        {order.transactions[0].gateway_transaction_id}
                      </Typography>
                    </>
                  ) : (
                    <Alert>Pago no encontrado</Alert>
                  )}
                </Card>
                <Card className={[classes.p1, classes.mt1]}>
                  <Typography variant="h2" component="h2">
                    Articulos
                  </Typography>
                  <TableContainer>
                    <Table aria-label="Orders">
                      <TableHead>
                        <TableRow>
                          <TableCell>Nombre</TableCell>
                          <TableCell align="right">Cantidad</TableCell>
                          <TableCell align="right">Precio</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {order.order.line_items.map((cartItem) => (
                          <TableRow key={cartItem.name}>
                            <TableCell component="th" scope="row">
                              {cartItem.name}
                            </TableCell>
                            <TableCell align="right">
                              {cartItem.quantity}
                            </TableCell>
                            <TableCell align="right">
                              {cartItem.price.formatted_with_symbol}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Card>
              </Grid>
              <Grid item md={3} xs={12}>
                <Card>
                  <Typography variant="h2" component="h2">
                    Resumen de la orden
                  </Typography>
                  <List>
                    <ListItem>
                      <Grid container>
                        <Grid item xs={6}>
                          <Typography>Subtotal</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography align="right">
                            {order.order.subtotal.formatted_with_symbol}
                          </Typography>
                        </Grid>
                      </Grid>
                    </ListItem>
                    <ListItem>
                      <Grid container>
                        <Grid item xs={6}>
                          <Typography>Tax</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography align="right">
                            {order.order.tax.amount.formatted_with_symbol}
                          </Typography>
                        </Grid>
                      </Grid>
                    </ListItem>
                    <ListItem>
                      <Grid container>
                        <Grid item xs={6}>
                          <Typography>Envio</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography align="right">
                            {order.order.shipping.price.formatted_with_symbol}
                          </Typography>
                        </Grid>
                      </Grid>
                    </ListItem>
                    <ListItem>
                      <Grid container>
                        <Grid item xs={6}>
                          <Typography>Total</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography align="right">
                            {order.order.total_with_tax.formatted_with_symbol}
                          </Typography>
                        </Grid>
                      </Grid>
                    </ListItem>
                    <ListItem>
                      <Grid container>
                        <Grid item xs={6}>
                          <Typography variant="h3">Pago total</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="h3" align="right">
                            {order.order.total_paid.formatted_with_symbol}
                          </Typography>
                        </Grid>
                      </Grid>
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
export default dynamic(() => Promise.resolve(Confirmation), {
  ssr: false,
});