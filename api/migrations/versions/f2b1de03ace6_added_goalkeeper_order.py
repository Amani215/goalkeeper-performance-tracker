"""Added: goalkeeper order

Revision ID: f2b1de03ace6
Revises: 68c066eddf13
Create Date: 2023-04-20 16:47:49.074102

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f2b1de03ace6'
down_revision = '68c066eddf13'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('match_monitoring', sa.Column('goalkeeper_order', sa.Integer(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('match_monitoring', 'goalkeeper_order')
    # ### end Alembic commands ###