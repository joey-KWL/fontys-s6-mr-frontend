import { Button, FormGroup, Grid, Stack, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate, useParams } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { useState } from "react";
import { DesktopDatePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { getDateToday } from "../../utils/date";

export default function VehicleDetail() {
	const params = useParams();
	const { data, error, loading } = useFetch(`http://localhost:8081/api/v1/vehicle/${params.id}`);
	const today = getDateToday()
	const [date, setDate] = useState(new Date(`${today.yyyy}-${today.mm}-${today.dd}`));
	const navigate = useNavigate();

	const changeDate = (date) => {
		setDate(date);
	};

	const submitInvoice = async (e) => {
		e.preventDefault()
		const {
			first_name,
			last_name,
			email,
			phone_number,
			street,
			house_number,
			zip_code,
			province,
			city,
			country } = e.target

		try {
			const res = await fetch("http://localhost:8086/api/v1/offer/request", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					first_name: first_name.value,
					last_name: last_name.value,
					email: email.value,
					phone_number: phone_number.value,
					street: street.value,
					house_number: house_number.value,
					zip_code: zip_code.value,
					province: province.value,
					city: city.value,
					country: country.value,
					vehicle_uuid: "UUID-vehicle-1"
				})
			})
			if (res.status === 200) {
				const result = await res.json()
				navigate("/invoice/success", { state: { offer: result, vehicle: data } })

			} else {
				console.log("error");
			}
		} catch (e) {
			console.log(e);
		}
	}

	if (loading) {
		return (
			<div>
				...loading
			</div>
		)
	}
	if (error) {
		return (
			<div>
				...something went wrong
			</div>
		)
	}

	console.log(data)

	return (
		<>
			<form onSubmit={submitInvoice}>
				<Grid container spacing={2}>

					<Grid item xs={7} pr={3}>
						Form hier
						<FormGroup>
							<div style={{ display: "flex" }}>
								<TextField label="First name" type="text" name="first_name" variant="standard" required sx={{ flex: 1 }} value="as" />
								<TextField label="Last name" type="text" name="last_name" variant="standard" required sx={{ flex: 1 }} value="ssdas" />
							</div>
							<TextField label="Email" type="email" name="email" variant="standard" required value="tes@asd" />
							<TextField label="Phone number" type="text" name="phone_number" variant="standard" required value="065874521" />
						</FormGroup>

						<FormGroup sx={{ mt: 3 }}>
							<TextField label="Street name" type="text" name="street" variant="standard" required value="street" />
							<TextField label="House nr" type="text" name="house_number" variant="standard" required value="23e" />
							<TextField label="Zip code" type="text" name="zip_code" variant="standard" required value="5555sd" />
							<TextField label="Province" type="text" name="province" variant="standard" required value="test" />
							<TextField label="City" type="text" name="city" variant="standard" required value="sdsd" />
							<TextField label="Country" type="text" name="country" variant="standard" required value="asasd" />
						</FormGroup>

						<FormGroup sx={{ mt: 3 }}>
							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<Stack spacing={3}>
									<DesktopDatePicker
										label="Delivery date"
										inputFormat="MM/dd/yyyy"
										value={date}
										onChange={changeDate}
										renderInput={(params) => <TextField {...params} />}
									/>
								</Stack>
							</LocalizationProvider>
						</FormGroup>

					</Grid>
					<Grid item xs={5}>
						<Typography mt={2} variant="h5">Preview</Typography>
						<div>
							<Box
								component="img"
								sx={{
									maxWidth: { xs: 200, md: 300 },
								}}
								alt="Selected vehicle."
								src={data.image_url}
							/>
							<Box>
								<Typography mt={3} variant="h5">Details</Typography>
								<Typography>Car: {data.brand.name} {data.model}</Typography>

							</Box>
							<Box>
								<Typography className="price">€ {data.price}</Typography>
							</Box>

							<FormGroup>
								<Button variant="contained" type="submit">Request invoice</Button>
							</FormGroup>
						</div>
					</Grid>
				</Grid>
			</form>

		</>
	)
}

