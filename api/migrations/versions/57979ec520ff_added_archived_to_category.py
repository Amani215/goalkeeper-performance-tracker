"""Added: archived to category

Revision ID: 57979ec520ff
Revises: f2b1de03ace6
Create Date: 2023-04-26 22:23:08.503554

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '57979ec520ff'
down_revision = 'f2b1de03ace6'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('category', sa.Column('archived', sa.Boolean(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('category', 'archived')
    # ### end Alembic commands ###
