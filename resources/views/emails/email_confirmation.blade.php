<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:seperate;border-spacing:8px">
	<tbody>
		<tr style="border-bottom:3px #f3f3f3">
			<td bgcolor="#ffffff" style="padding:40px 35px">
				<table width="100%" cellpadding="0" cellspacing="0">
					<tbody>
						<tr>
							<td align="center" style="padding:0 0 24px">
								<img src="{{Request::root()}}/assets/front/img/logo.png" height="66" width="66" style="vertical-align:top;height:66px;width:66px">
							</td>
						</tr>
						<tr>
							<td align="center" style="font:24px/28px Helvetica,Arial,Roboto,Noto,sans-serif;color:#ff6600;letter-spacing:-0.3px;padding:0 0 2px">
								Confirm your email address on giveadinnerparty
							</td>
						</tr>
						<tr>
							<td align="center" style="font:18px/22px Helvetica,Arial,Roboto,Noto,sans-serif;color:#484848">
								Thanks for creating an account on <a href="{{Request::root()}}" target="_blank">giveadinnerparty</a>.
							</td>
						</tr>
						<tr>
							<td align="center" style="font:18px/22px Helvetica,Arial,Roboto,Noto,sans-serif;color:#484848">
								Your account is incomplete. Please click the link below to confirm your email address.
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
												<a style="text-decoration:none;color:#fff;display:block;padding:16px 15px" href="{{Request::root()}}/user/verify_email/<?php echo $user->confirmation_code; ?>" target="_blank">
													Confirm your email address
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