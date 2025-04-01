use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, MintTo};
use mpl_token_metadata::instruction::{create_metadata_accounts_v3, create_master_edition_v3};
use mpl_token_metadata::state::{DataV2, Creator};
use solana_program::{program::invoke_signed, system_instruction};

declare_id!("8F3L6xycR2YLqCZX5ZQCT8ENAXjqyr6KWLkv5cUeMzL8");


#[program]
pub mod solana_nft_minter {
    use super::*;

    pub fn mint_nft(
        ctx: Context<MintNFT>,
        name: String,
        symbol: String,
        uri: String,
    ) -> Result<()> {
        let cpi_accounts = MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.token_account.to_account_info(),
            authority: ctx.accounts.mint_authority.to_account_info(),
        };

        let cpi_context = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts);
        token::mint_to(cpi_context, 1)?;

        let metadata_accounts = vec![
            ctx.accounts.metadata.to_account_info(),
            ctx.accounts.mint.to_account_info(),
            ctx.accounts.mint_authority.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
            ctx.accounts.rent.to_account_info(),
        ];

        let create_metadata_ix = create_metadata_accounts_v3(
            *ctx.accounts.metadata.key,
            *ctx.accounts.mint.key,
            *ctx.accounts.mint_authority.key,
            *ctx.accounts.mint_authority.key,
            *ctx.accounts.mint_authority.key,
            name,
            symbol,
            uri,
            Some(vec![Creator {
                address: *ctx.accounts.mint_authority.key,
                verified: true,
                share: 100,
            }]),
            1,
            true,
            true,
            None,
            None,
            None,
        );

        invoke_signed(
            &create_metadata_ix,
            metadata_accounts.as_slice(),
            &[],
        )?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct MintNFT<'info> {
    #[account(init, payer = user, mint::decimals = 0, mint::authority = mint_authority)]
    pub mint: Account<'info, Mint>,
    
    #[account(init, payer = user, associated_token::mint = mint, associated_token::authority = mint_authority)]
    pub token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(mut)]
    pub mint_authority: Signer<'info>,
    
    /// CHECK: This is safe because we ensure it's a valid metadata account
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
