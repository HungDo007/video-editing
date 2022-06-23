using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using video_editing_api.Model;
using video_editing_api.Model.Collection;
using video_editing_api.Model.InputModel;

namespace video_editing_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IConfiguration _config;
        public UsersController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, IConfiguration config)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _config = config;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok();
        }


        [HttpPost("SignUp")]
        public async Task<IActionResult> SignUp(AccountModel account)
        {
            try
            {
                var user = await _userManager.FindByNameAsync(account.Username);
                if (user != null)
                {
                    return BadRequest(new Response<string>(400, "Username already used", null));
                }
                user = await _userManager.FindByEmailAsync(account.Email);
                if (user != null)
                {
                    return BadRequest(new Response<string>(400, "Email already used", null));
                }

                user = new AppUser
                {
                    UserName = account.Username,
                    Email = account.Email,
                    FullName = account.FullName,
                };

                var res = await _userManager.CreateAsync(user, account.Password);
                if (res.Succeeded)
                {
                    return Ok(new Response<string>(200, "", "Succeed"));
                }
                else
                {
                    return BadRequest(new Response<string>(400, "An unknown error occurred, please try again.", null));
                }

            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<string>(400, e.Message, null));
            }

        }


        [HttpPost("SignIn")]
        public async Task<IActionResult> SignIn(AccountModel account)
        {
            try
            {
                var user = await _userManager.FindByNameAsync(account.Username);
                if (user == null)
                {
                    user = await _userManager.FindByEmailAsync(account.Username) != null ? await _userManager.FindByEmailAsync(account.Username) : null;
                }
                if (user == null)
                {
                    return BadRequest(new Response<string>(400, "Incorrect Username", null));
                }

                var result = await _signInManager.PasswordSignInAsync(user, account.Password, true, true);
                if (!result.Succeeded)
                {
                    return BadRequest(new Response<string>(400, "Incorrect Password", null));
                }

                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name,user.UserName)
                };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Tokens:Key"]));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(claims),
                    Expires = DateTime.Now.AddHours(2),
                    SigningCredentials = creds,
                };

                var tokenHandler = new JwtSecurityTokenHandler();
                var token = tokenHandler.CreateToken(tokenDescriptor);

                var res = new
                {
                    Token = tokenHandler.WriteToken(token),
                    FullName = user.FullName,
                    Username = user.UserName,
                };
                return Ok(new Response<object>(200, "", res));
            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<string>(400, e.Message, null));
            }

        }
    }
}
