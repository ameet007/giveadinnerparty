<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:seperate;border-spacing:8px">
	<tbody>
		<tr style="border-bottom:3px #f3f3f3">
			<td bgcolor="#ffffff" style="padding:40px 35px">
				<table width="100%" cellpadding="0" cellspacing="0">
					<tbody>
						<tr>
							<td align="left" style="padding:0 0 24px">
								<h2>Hello <?php echo  $invite_user->name.' '.$invite_user->last_name; ?>,</h2>
							</td>
						</tr>
						
						<tr>
							<td align="center" style="font:18px/22px Helvetica,Arial,Roboto,Noto,sans-serif;color:#484848">
								You are receiving this email because <?php echo $login_user->name; ?>  invite you for dinner party.
							</td>
						</tr>
						<tr>
							<td align="center" style="font:18px/22px Helvetica,Arial,Roboto,Noto,sans-serif;color:#484848">
								Please click the link below to booking.
							</td>
						</tr>
						<tr>
							<td style="padding:20px 0 0">
								<table width="100%" cellpadding="0" cellspacing="0">
									<tbody>
										<tr>
											<td align="center" style="border-top:1px solid #c9c9c9;padding:0 0 45px"></td>
										</tr>
									</tbody>
								</table>
							</td>
						</tr>
						<tr>
							<td>
								<table align="center" style="margin:0 auto" cellpadding="0" cellspacing="0">
									<tbody>
										<tr>
											<td width="310" align="center" style="font:bold 21px/24px Helvetica,Arial,sans-serif;color:#fff;border-radius:5px;background-size:100% 100%;" bgcolor="#013cbb">
												<a style="text-decoration:none;color:#fff;display:block;padding:16px 15px" href="<?php echo Request::root().'/user/event_payment/'.Crypt::encrypt($invite_user->id).'/'.Crypt::encrypt($event->id); ?>" target="_blank">
													Click Here To booking
												</a>
											</td>
										</tr>
									</tbody>
								</table>
							</td>
						</tr>
					</tbody>
				</table>
			</td>
		</tr>
    </tbody>
</table>